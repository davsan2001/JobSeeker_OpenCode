// @ts-nocheck - Temporary until Supabase types are properly configured
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { decryptSecret, encryptSecret } from '@/lib/crypto'
import { PROVIDERS } from '@/lib/llm'
import type { ProviderId } from '@/lib/llm/types'
import type {
  ApplicationMeta,
  CVSummary,
  EvalReport,
  GeneratedDocs,
  IntelReport,
  UserConfig,
  GoogleConnectionPublic
} from '@/lib/types'

interface StoredProviderConfig {
  model: string
  baseUrl?: string
  apiKeyEnc?: string
}

function emptyConfig(): UserConfig {
  return {
    activeProvider: 'anthropic',
    providers: {},
    mode: 'fast',
    userLocale: 'auto',
    createdAt: new Date().toISOString()
  }
}

export async function getConfig(userId: string): Promise<UserConfig | null> {
  const supabase = createSupabaseServerClient()
  
  const { data: config, error } = await supabase
    .from('configs')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  const configRow = config as { active_provider: string; mode: string; user_locale: string; monthly_token_budget: number | null; monthly_tokens_used: number; month_key: string | null; created_at: string } | null

  if (error || !configRow) return null

  const { data: providerConfigs } = await supabase
    .from('provider_configs')
    .select('*')
    .eq('user_id', userId)

  const providers: UserConfig['providers'] = {}
  const pcArray = providerConfigs as Array<{ provider_id: string; model: string; base_url: string | null; api_key_enc: string | null }> | null
  if (pcArray) {
    for (const pc of pcArray) {
      providers[pc.provider_id as ProviderId] = {
        model: pc.model,
        baseUrl: pc.base_url || undefined,
        hasKey: !!pc.api_key_enc
      }
    }
  }

  return {
    activeProvider: configRow.active_provider as ProviderId,
    providers,
    mode: configRow.mode as 'fast' | 'full',
    userLocale: configRow.user_locale,
    monthlyTokenBudget: configRow.monthly_token_budget || undefined,
    monthlyTokensUsed: configRow.monthly_tokens_used,
    monthKey: configRow.month_key || undefined,
    createdAt: configRow.created_at
  }
}

interface SaveConfigPatch {
  activeProvider?: ProviderId
  provider?: {
    id: ProviderId
    apiKey?: string
    clearApiKey?: boolean
    model?: string
    baseUrl?: string
  }
  mode?: 'fast' | 'full'
  monthlyTokenBudget?: number
}

export async function saveConfig(userId: string, patch: SaveConfigPatch): Promise<UserConfig> {
  const supabase = createSupabaseServerClient()
  let current = await getConfig(userId)
  
  if (!current) {
    console.log('[saveConfig] Creating new config for user:', userId)
    const { data, error: insertError } = await supabase
      .from('configs')
      .insert({ user_id: userId, active_provider: 'google', mode: 'fast' })
      .select()
      .single()
    
    if (insertError) {
      console.error('[saveConfig] Insert error:', insertError)
      throw new Error('Failed to create config: ' + insertError.message)
    }
    
    console.log('[saveConfig] Created config:', data)
    current = await getConfig(userId)
  }
  
  if (!current) throw new Error('Config not found - failed to create')

  if (patch.mode !== undefined) current.mode = patch.mode
  if (patch.monthlyTokenBudget !== undefined) current.monthlyTokenBudget = patch.monthlyTokenBudget
  if (patch.activeProvider) current.activeProvider = patch.activeProvider

  // @ts-ignore - Supabase types issue
  await supabase
    .from('configs')
    .update({
      active_provider: current.activeProvider,
      mode: current.mode,
      monthly_token_budget: current.monthlyTokenBudget || null,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)

  if (patch.provider) {
    const pid = patch.provider.id
    const existing = current.providers[pid]
    const model = patch.provider.model || existing?.model || PROVIDERS[pid].defaultModels[0].id
    const baseUrl = patch.provider.baseUrl || existing?.baseUrl

    if (patch.provider.apiKey) {
      await supabase
        .from('provider_configs')
        .upsert({
          user_id: userId,
          provider_id: pid,
          model,
          base_url: baseUrl || null,
          api_key_enc: encryptSecret(patch.provider.apiKey),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,provider_id' })
    } else if (patch.provider.clearApiKey) {
      await supabase
        .from('provider_configs')
        .update({
          api_key_enc: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('provider_id', pid)
    } else {
      await supabase
        .from('provider_configs')
        .upsert({
          user_id: userId,
          provider_id: pid,
          model,
          base_url: baseUrl || null,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,provider_id' })
    }
  }

  return (await getConfig(userId)) || emptyConfig()
}

export async function getActiveProviderCallable(userId: string): Promise<{
  id: ProviderId
  cfg: { model: string; baseUrl?: string; apiKey?: string }
} | null> {
  const supabase = createSupabaseServerClient()

  const { data: config } = await supabase
    .from('configs')
    .select('active_provider')
    .eq('user_id', userId)
    .maybeSingle()

  if (!config) return null

  const id = config.active_provider as ProviderId

  const { data: providerConfig } = await supabase
    .from('provider_configs')
    .select('*')
    .eq('user_id', userId)
    .eq('provider_id', id)
    .maybeSingle()

  if (!providerConfig) {
    console.log('[getActiveProviderCallable] No provider config for', id)
    return null
  }

  const cfg: { model: string; baseUrl?: string; apiKey?: string } = {
    model: providerConfig.model,
    baseUrl: providerConfig.base_url || undefined
  }

  if (providerConfig.api_key_enc) {
    try {
      cfg.apiKey = decryptSecret(providerConfig.api_key_enc)
    } catch {
      return null
    }
  }

  const provider = PROVIDERS[id]
  if (provider.requiresApiKey && !cfg.apiKey) return null

  return { id, cfg }
}

export async function incrementTokenUsage(userId: string, tokens: number) {
  const supabase = createSupabaseServerClient()
  const nowMonth = new Date().toISOString().slice(0, 7)

  const { data: config } = await supabase
    .from('configs')
    .select('monthly_tokens_used, month_key')
    .eq('user_id', userId)
    .single()

  let newUsed = tokens
  if (config && config.month_key === nowMonth) {
    newUsed = (config.monthly_tokens_used || 0) + tokens
  }

  await supabase
    .from('configs')
    .update({
      monthly_tokens_used: newUsed,
      month_key: nowMonth,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
}

export async function saveCvRaw(userId: string, text: string) {
  const supabase = createSupabaseServerClient()
  await supabase
    .from('cv_documents')
    .upsert({
      user_id: userId,
      raw_text: text,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })
}

export async function getCvRaw(userId: string): Promise<string | null> {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('cv_documents')
    .select('raw_text')
    .eq('user_id', userId)
    .single()
  return data?.raw_text || null
}

export async function saveCvSummary(userId: string, summary: CVSummary) {
  const supabase = createSupabaseServerClient()
  await supabase
    .from('cv_documents')
    .update({
      summary: summary as unknown as Record<string, unknown>,
      summarized_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
}

export async function getCvSummary(userId: string): Promise<CVSummary | null> {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('cv_documents')
    .select('summary')
    .eq('user_id', userId)
    .single()
  return data?.summary as CVSummary | null
}

function slugifyCompany(company: string): string {
  return company
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)
}

export async function saveApplicationMeta(userId: string, meta: ApplicationMeta) {
  const supabase = createSupabaseServerClient()
  
  const existing = await supabase
    .from('applications')
    .select('id')
    .eq('id', meta.id)
    .maybeSingle()

  if (existing) {
    await supabase
      .from('applications')
      .update({
        company: meta.company,
        role: meta.role,
        company_slug: meta.companySlug,
        description: meta.description,
        url: meta.url || null,
        user_notes: meta.userNotes || null,
        mode: meta.mode,
        status: meta.status,
        user_decision: meta.userDecision || null,
        total_tokens: meta.totalTokens || 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', meta.id)
  } else {
    await supabase
      .from('applications')
      .insert({
        id: meta.id,
        user_id: userId,
        company: meta.company,
        role: meta.role,
        company_slug: meta.companySlug,
        description: meta.description,
        url: meta.url || null,
        user_notes: meta.userNotes || null,
        mode: meta.mode,
        status: meta.status,
        user_decision: meta.userDecision || null,
        total_tokens: meta.totalTokens || 0,
        created_at: meta.createdAt,
        updated_at: meta.updatedAt
      })
  }
}

export async function getApplicationMeta(userId: string, id: string): Promise<ApplicationMeta | null> {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', userId)
    .eq('id', id)
    .single()

  if (!data) return null

  return {
    id: data.id,
    company: data.company,
    role: data.role,
    companySlug: data.company_slug,
    description: data.description,
    url: data.url || undefined,
    userNotes: data.user_notes || undefined,
    mode: data.mode,
    status: data.status,
    userDecision: data.user_decision || undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    totalTokens: data.total_tokens || undefined
  }
}

export async function listApplications(userId: string): Promise<ApplicationMeta[]> {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return data.map(d => ({
    id: d.id,
    company: d.company,
    role: d.role,
    companySlug: d.company_slug,
    description: d.description,
    url: d.url || undefined,
    userNotes: d.user_notes || undefined,
    mode: d.mode,
    status: d.status,
    userDecision: d.user_decision || undefined,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
    totalTokens: d.total_tokens || undefined
  }))
}

export async function saveIntel(applicationId: string, intel: IntelReport) {
  const supabase = createSupabaseServerClient()
  await supabase
    .from('intels')
    .upsert({
      application_id: applicationId,
      data: intel as unknown as Record<string, unknown>,
      tokens_used: intel.tokens_used || 0,
      generated_at: intel.generated_at
    }, { onConflict: 'application_id' })
}

export async function getIntel(applicationId: string): Promise<IntelReport | null> {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('intels')
    .select('data')
    .eq('application_id', applicationId)
    .single()
  return data?.data as IntelReport | null
}

export async function saveEval(applicationId: string, evalReport: EvalReport) {
  const supabase = createSupabaseServerClient()
  await supabase
    .from('evals')
    .upsert({
      application_id: applicationId,
      data: evalReport as unknown as Record<string, unknown>,
      tokens_used: evalReport.tokens_used || 0,
      generated_at: evalReport.generated_at
    }, { onConflict: 'application_id' })
}

export async function getEval(applicationId: string): Promise<EvalReport | null> {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('evals')
    .select('data')
    .eq('application_id', applicationId)
    .single()
  return data?.data as EvalReport | null
}

export async function saveDocs(applicationId: string, docs: GeneratedDocs) {
  const supabase = createSupabaseServerClient()
  await supabase
    .from('docs')
    .upsert({
      application_id: applicationId,
      cv_markdown: docs.cv_markdown,
      cover_letter_markdown: docs.cover_letter_markdown,
      email_subject: docs.email_subject,
      email_body: docs.email_body,
      review: docs.cv_review as unknown as Record<string, unknown>,
      tokens_used: docs.tokens_used || 0,
      updated_at: new Date().toISOString()
    }, { onConflict: 'application_id' })
}

export async function getDocs(applicationId: string): Promise<GeneratedDocs | null> {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('docs')
    .select('*')
    .eq('application_id', applicationId)
    .single()

  if (!data) return null

  return {
    cv_markdown: data.cv_markdown,
    cv_review: data.review as GeneratedDocs['cv_review'],
    cover_letter_markdown: data.cover_letter_markdown,
    email_subject: data.email_subject,
    email_body: data.email_body,
    tokens_used: data.tokens_used || undefined
  }
}

export async function getCompanyCache(slug: string): Promise<IntelReport | null> {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('company_intel_cache')
    .select('intel')
    .eq('company_slug', slug)
    .single()
  return data?.intel as IntelReport | null
}

export async function setCompanyCache(slug: string, intel: IntelReport) {
  const supabase = createSupabaseServerClient()
  await supabase
    .from('company_intel_cache')
    .upsert({
      company_slug: slug,
      intel: intel as unknown as Record<string, unknown>,
      cached_at: new Date().toISOString()
    }, { onConflict: 'company_slug' })
}

export function newApplicationId(): string {
  const { randomBytes } = require('crypto')
  return randomBytes(6).toString('hex')
}

export { slugifyCompany }