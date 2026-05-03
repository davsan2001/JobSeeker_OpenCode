import { promises as fs } from 'node:fs';
import { join, dirname } from 'node:path';
import { randomBytes } from 'node:crypto';
import { decryptSecret, encryptSecret } from './crypto';
import { PROVIDERS } from './llm';
import { refreshAccessToken, type OAuthTokens } from './google';
import type { ProviderConfig, ProviderId } from './llm/types';
import type {
  ApplicationMeta,
  CVSummary,
  EvalReport,
  GeneratedDocs,
  IntelReport,
  UserConfig,
  ProviderPublicConfig,
  GoogleConnectionPublic
} from './types';

const DATA_DIR = process.env.JOBSEEKER_DATA_DIR || join(process.cwd(), 'data');
const CONFIG_PATH = join(DATA_DIR, 'config.json');
const USER_DIR = join(DATA_DIR, 'user');
const APP_DIR = join(DATA_DIR, 'applications');
const CACHE_DIR = join(DATA_DIR, 'cache', 'companies');

async function ensureDir(path: string) {
  await fs.mkdir(path, { recursive: true });
}
async function readJson<T>(path: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(path, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
async function writeJson(path: string, data: unknown) {
  await ensureDir(dirname(path));
  await fs.writeFile(path, JSON.stringify(data, null, 2), 'utf8');
}

// ------ Config ------
interface StoredProviderConfig {
  model: string;
  baseUrl?: string;
  apiKeyEnc?: string;
}
interface StoredGoogleConnection {
  clientId?: string;
  clientSecretEnc?: string;
  refreshTokenEnc?: string;
  email?: string;
  scopes?: string[];
  connectedAt?: string;
  // Volatile cache of the last access token so we don't burn a refresh call on
  // every request. We store it encrypted-at-rest and with its expiry.
  accessTokenEnc?: string;
  accessTokenExpiresAt?: number; // epoch ms
}

interface StoredConfig {
  activeProvider: ProviderId;
  providers: Partial<Record<ProviderId, StoredProviderConfig>>;
  mode: 'fast' | 'full';
  userLocale: string;
  monthlyTokenBudget?: number;
  monthlyTokensUsed?: number;
  monthKey?: string;
  createdAt: string;
  google?: StoredGoogleConnection;
}

function emptyConfig(): StoredConfig {
  return {
    activeProvider: 'anthropic',
    providers: {},
    mode: 'fast',
    userLocale: 'auto',
    createdAt: new Date().toISOString()
  };
}

/**
 * Tolerate configs stored by older builds that didn't have the multi-provider
 * shape. Before the refactor the file looked like
 *   { apiKeyEnc, model, mode, ... }
 * with no `providers` field. Reading that raw into StoredConfig leaves
 * `providers` as undefined, which then throws
 *   "Cannot read properties of undefined (reading 'groq')"
 * when we try to index it.
 */
function normalizeStoredConfig(raw: StoredConfig | null): StoredConfig {
  if (!raw) return emptyConfig();
  const legacy = raw as unknown as {
    apiKeyEnc?: string;
    model?: string;
    baseUrl?: string;
  };
  if (!raw.providers || typeof raw.providers !== 'object') {
    raw.providers = {};
    // Migrate the old single-provider shape into the new `providers.anthropic`
    // slot so the user doesn't lose their saved key.
    if (legacy.apiKeyEnc || legacy.model) {
      raw.providers.anthropic = {
        model: legacy.model || 'claude-haiku-4-5-20251001',
        baseUrl: legacy.baseUrl,
        apiKeyEnc: legacy.apiKeyEnc
      };
    }
  }
  if (!raw.activeProvider) raw.activeProvider = 'anthropic';
  if (!raw.mode) raw.mode = 'fast';
  if (!raw.userLocale) raw.userLocale = 'auto';
  if (!raw.createdAt) raw.createdAt = new Date().toISOString();
  if (!raw.google) raw.google = {};
  return raw;
}

function toPublicGoogle(g: StoredGoogleConnection | undefined): GoogleConnectionPublic | undefined {
  if (!g) return undefined;
  const hasClient = !!(g.clientId && g.clientSecretEnc);
  return {
    hasClient,
    clientIdMasked: g.clientId ? maskClientId(g.clientId) : undefined,
    connected: !!g.refreshTokenEnc,
    email: g.email,
    scopes: g.scopes,
    connectedAt: g.connectedAt
  };
}

function maskClientId(id: string): string {
  // Google Client IDs look like 1234567890-abcde.apps.googleusercontent.com —
  // show enough to tell two of them apart without leaking the whole thing.
  if (id.length <= 14) return id;
  return `${id.slice(0, 6)}…${id.slice(-8)}`;
}

function toPublic(raw: StoredConfig): UserConfig {
  const providers: UserConfig['providers'] = {};
  for (const [id, cfg] of Object.entries(raw.providers || {})) {
    const typed = cfg as StoredProviderConfig;
    providers[id as ProviderId] = {
      model: typed.model,
      baseUrl: typed.baseUrl,
      hasKey: !!typed.apiKeyEnc
    };
  }
  return {
    activeProvider: raw.activeProvider,
    providers,
    mode: raw.mode,
    userLocale: raw.userLocale,
    monthlyTokenBudget: raw.monthlyTokenBudget,
    monthlyTokensUsed: raw.monthlyTokensUsed,
    monthKey: raw.monthKey,
    createdAt: raw.createdAt,
    google: toPublicGoogle(raw.google)
  };
}

export async function getConfig(): Promise<UserConfig | null> {
  const rawOnDisk = await readJson<StoredConfig>(CONFIG_PATH);
  if (!rawOnDisk) return null;
  return toPublic(normalizeStoredConfig(rawOnDisk));
}

interface SaveConfigPatch {
  activeProvider?: ProviderId;
  provider?: {
    id: ProviderId;
    apiKey?: string;
    clearApiKey?: boolean;
    model?: string;
    baseUrl?: string;
  };
  mode?: 'fast' | 'full';
  monthlyTokenBudget?: number;
}

export async function saveConfig(patch: SaveConfigPatch): Promise<UserConfig> {
  const current = normalizeStoredConfig(await readJson<StoredConfig>(CONFIG_PATH));

  if (patch.mode) current.mode = patch.mode;
  if (patch.monthlyTokenBudget !== undefined) current.monthlyTokenBudget = patch.monthlyTokenBudget;
  if (patch.activeProvider) current.activeProvider = patch.activeProvider;

  if (patch.provider) {
    const pid = patch.provider.id;
    const existing: StoredProviderConfig = current.providers[pid] || {
      model: defaultModelFor(pid)
    };
    if (patch.provider.model) existing.model = patch.provider.model;
    if (patch.provider.baseUrl !== undefined) existing.baseUrl = patch.provider.baseUrl || undefined;
    if (patch.provider.apiKey) existing.apiKeyEnc = encryptSecret(patch.provider.apiKey);
    if (patch.provider.clearApiKey) existing.apiKeyEnc = undefined;
    current.providers[pid] = existing;
  }

  await writeJson(CONFIG_PATH, current);
  return toPublic(current);
}

function defaultModelFor(id: ProviderId): string {
  return PROVIDERS[id].defaultModels[0].id;
}

/** Returns the decrypted, ready-to-call config for the currently-active provider. */
export async function getActiveProviderCallable(): Promise<{
  id: ProviderId;
  cfg: ProviderConfig;
} | null> {
  const rawOnDisk = await readJson<StoredConfig>(CONFIG_PATH);
  if (!rawOnDisk) return null;
  const raw = normalizeStoredConfig(rawOnDisk);
  const id = raw.activeProvider;
  const stored = raw.providers[id];
  if (!stored) return null;
  const cfg: ProviderConfig = {
    model: stored.model,
    baseUrl: stored.baseUrl
  };
  if (stored.apiKeyEnc) {
    try {
      cfg.apiKey = decryptSecret(stored.apiKeyEnc);
    } catch {
      return null;
    }
  }
  const provider = PROVIDERS[id];
  if (provider.requiresApiKey && !cfg.apiKey) return null;
  return { id, cfg };
}

export async function incrementTokenUsage(tokens: number) {
  const raw = normalizeStoredConfig(await readJson<StoredConfig>(CONFIG_PATH));
  const nowMonth = new Date().toISOString().slice(0, 7);
  if (raw.monthKey !== nowMonth) {
    raw.monthKey = nowMonth;
    raw.monthlyTokensUsed = 0;
  }
  raw.monthlyTokensUsed = (raw.monthlyTokensUsed || 0) + tokens;
  await writeJson(CONFIG_PATH, raw);
}

// ------ CV ------
export async function saveCvRaw(text: string) {
  await ensureDir(USER_DIR);
  await fs.writeFile(join(USER_DIR, 'cv-raw.txt'), text, 'utf8');
}
export async function getCvRaw(): Promise<string | null> {
  try {
    return await fs.readFile(join(USER_DIR, 'cv-raw.txt'), 'utf8');
  } catch {
    return null;
  }
}
export async function saveCvSummary(summary: CVSummary) {
  await writeJson(join(USER_DIR, 'cv-summary.json'), summary);
}
export async function getCvSummary(): Promise<CVSummary | null> {
  return readJson<CVSummary>(join(USER_DIR, 'cv-summary.json'));
}

// ------ Applications ------
export function newApplicationId(): string {
  return randomBytes(6).toString('hex');
}

export function slugifyCompany(company: string): string {
  return company
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

function appDir(id: string) {
  return join(APP_DIR, id);
}

export async function saveApplicationMeta(meta: ApplicationMeta) {
  await writeJson(join(appDir(meta.id), 'meta.json'), meta);
}
export async function getApplicationMeta(id: string): Promise<ApplicationMeta | null> {
  return readJson<ApplicationMeta>(join(appDir(id), 'meta.json'));
}
export async function listApplications(): Promise<ApplicationMeta[]> {
  try {
    const ids = await fs.readdir(APP_DIR);
    const metas = await Promise.all(ids.map((id) => getApplicationMeta(id)));
    return metas.filter((m): m is ApplicationMeta => !!m).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  } catch {
    return [];
  }
}

export async function saveIntel(id: string, intel: IntelReport) {
  await writeJson(join(appDir(id), 'intel.json'), intel);
}
export async function getIntel(id: string): Promise<IntelReport | null> {
  return readJson<IntelReport>(join(appDir(id), 'intel.json'));
}

export async function saveEval(id: string, evalReport: EvalReport) {
  await writeJson(join(appDir(id), 'eval.json'), evalReport);
}
export async function getEval(id: string): Promise<EvalReport | null> {
  return readJson<EvalReport>(join(appDir(id), 'eval.json'));
}

export async function saveDocs(id: string, docs: GeneratedDocs) {
  await writeJson(join(appDir(id), 'docs.json'), docs);
  await fs.writeFile(join(appDir(id), 'cv.md'), docs.cv_markdown, 'utf8');
  await fs.writeFile(join(appDir(id), 'cover-letter.md'), docs.cover_letter_markdown, 'utf8');
}
export async function getDocs(id: string): Promise<GeneratedDocs | null> {
  return readJson<GeneratedDocs>(join(appDir(id), 'docs.json'));
}

// ------ Company intel cache ------
export async function getCompanyCache(slug: string): Promise<IntelReport | null> {
  return readJson<IntelReport>(join(CACHE_DIR, `${slug}.json`));
}
export async function setCompanyCache(slug: string, intel: IntelReport) {
  await writeJson(join(CACHE_DIR, `${slug}.json`), intel);
}

// ------ Google connection (OAuth + tokens) ------

/** Public status shape safe to send to the browser. No secrets. */
export async function getGoogleConnectionPublic(): Promise<GoogleConnectionPublic> {
  const raw = normalizeStoredConfig(await readJson<StoredConfig>(CONFIG_PATH));
  return toPublicGoogle(raw.google) || { hasClient: false, connected: false };
}

/** Persist the user-pasted OAuth client (Client ID + Secret). */
export async function saveGoogleOAuthClient(clientId: string, clientSecret: string): Promise<void> {
  const raw = normalizeStoredConfig(await readJson<StoredConfig>(CONFIG_PATH));
  raw.google = {
    ...(raw.google || {}),
    clientId: clientId.trim(),
    clientSecretEnc: encryptSecret(clientSecret.trim())
  };
  await writeJson(CONFIG_PATH, raw);
}

/** Returns {clientId, clientSecret} ready to use for an OAuth exchange. */
export async function getGoogleOAuthClient(): Promise<{ clientId: string; clientSecret: string } | null> {
  const raw = normalizeStoredConfig(await readJson<StoredConfig>(CONFIG_PATH));
  const g = raw.google;
  if (!g?.clientId || !g.clientSecretEnc) return null;
  try {
    return { clientId: g.clientId, clientSecret: decryptSecret(g.clientSecretEnc) };
  } catch {
    return null;
  }
}

/** After a successful OAuth code exchange, persist the refresh token + metadata. */
export async function saveGoogleTokens(args: {
  tokens: OAuthTokens;
  email: string;
}): Promise<void> {
  const raw = normalizeStoredConfig(await readJson<StoredConfig>(CONFIG_PATH));
  const g: StoredGoogleConnection = { ...(raw.google || {}) };
  if (args.tokens.refresh_token) {
    g.refreshTokenEnc = encryptSecret(args.tokens.refresh_token);
  }
  g.email = args.email;
  g.scopes = args.tokens.scope ? args.tokens.scope.split(/\s+/) : g.scopes;
  g.connectedAt = new Date().toISOString();
  // Cache the access token so the first few calls after connect skip a refresh.
  g.accessTokenEnc = encryptSecret(args.tokens.access_token);
  g.accessTokenExpiresAt = Date.now() + args.tokens.expires_in * 1000 - 60_000; // -60s safety margin
  raw.google = g;
  await writeJson(CONFIG_PATH, raw);
}

/** Wipe the connection. Leaves Client ID/Secret in place so user can reconnect easily. */
export async function disconnectGoogle(): Promise<void> {
  const raw = normalizeStoredConfig(await readJson<StoredConfig>(CONFIG_PATH));
  if (raw.google) {
    raw.google.refreshTokenEnc = undefined;
    raw.google.email = undefined;
    raw.google.scopes = undefined;
    raw.google.connectedAt = undefined;
    raw.google.accessTokenEnc = undefined;
    raw.google.accessTokenExpiresAt = undefined;
  }
  await writeJson(CONFIG_PATH, raw);
}

/** Fully clear Google — including the Client ID + Secret. */
export async function forgetGoogleOAuthClient(): Promise<void> {
  const raw = normalizeStoredConfig(await readJson<StoredConfig>(CONFIG_PATH));
  raw.google = {};
  await writeJson(CONFIG_PATH, raw);
}

/**
 * Returns a valid access token, refreshing transparently if the cached one has
 * expired. Throws if the user hasn't connected yet.
 */
export async function getGoogleAccessToken(): Promise<string> {
  const raw = normalizeStoredConfig(await readJson<StoredConfig>(CONFIG_PATH));
  const g = raw.google;
  if (!g?.clientId || !g.clientSecretEnc || !g.refreshTokenEnc) {
    throw new Error('Google is not connected. Open Settings → Connections.');
  }

  // Use the cached access token if still valid.
  if (g.accessTokenEnc && g.accessTokenExpiresAt && g.accessTokenExpiresAt > Date.now()) {
    try {
      return decryptSecret(g.accessTokenEnc);
    } catch {
      // fall through to refresh
    }
  }

  const clientSecret = decryptSecret(g.clientSecretEnc);
  const refreshToken = decryptSecret(g.refreshTokenEnc);
  const refreshed = await refreshAccessToken({
    clientId: g.clientId,
    clientSecret,
    refreshToken
  });

  g.accessTokenEnc = encryptSecret(refreshed.access_token);
  g.accessTokenExpiresAt = Date.now() + refreshed.expires_in * 1000 - 60_000;
  raw.google = g;
  await writeJson(CONFIG_PATH, raw);

  return refreshed.access_token;
}

/** Convenience: email attached to the connected Google account, if any. */
export async function getGoogleEmail(): Promise<string | null> {
  const raw = normalizeStoredConfig(await readJson<StoredConfig>(CONFIG_PATH));
  return raw.google?.email || null;
}

export const PATHS = { DATA_DIR, APP_DIR, USER_DIR, CACHE_DIR };

// Re-export for convenience (unused currently but kept for external callers)
export type { ProviderPublicConfig };
