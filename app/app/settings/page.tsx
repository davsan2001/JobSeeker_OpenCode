'use client'

import { useEffect, useState } from 'react'
import type { UserConfig } from '@/lib/types'
import type { ProviderId } from '@/lib/llm/types'

const PROVIDER_MODELS: Record<ProviderId, { id: string; label: string }[]> = {
  anthropic: [
    { id: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
    { id: 'claude-haiku-3-5-20250620', label: 'Claude Haiku 3.5' },
    { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
    { id: 'claude-3-opus-20240229', label: 'Claude 3 Opus' }
  ],
  google: [
    { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (recommended)' },
    { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
    { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
    { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
    { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' }
  ],
  openai: [
    { id: 'gpt-4o', label: 'GPT-4o' },
    { id: 'gpt-4o-mini', label: 'GPT-4o Mini (cheap)' },
    { id: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { id: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
  ],
  groq: [
    { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B (recommended)' },
    { id: 'llama-3.1-70b-versatile', label: 'Llama 3.1 70B' },
    { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
    { id: 'gemma2-9b-it', label: 'Gemma 2 9B' }
  ],
  ollama: [
    { id: 'llama3.3', label: 'Llama 3.3' },
    { id: 'llama3.1', label: 'Llama 3.1' },
    { id: 'qwen2.5', label: 'Qwen 2.5' },
    { id: 'mistral', label: 'Mistral' }
  ],
  'claude-code': [
    { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5' },
    { id: 'claude-sonnet-4-5-20251001', label: 'Claude Sonnet 4.5' }
  ]
}

const PROVIDER_LABELS: Record<ProviderId, string> = {
  anthropic: 'Anthropic (Claude)',
  google: 'Google Gemini',
  openai: 'OpenAI GPT',
  groq: 'Groq (free tier)',
  ollama: 'Ollama (local)',
  'claude-code': 'Claude Code'
}

export default function SettingsPage() {
  const [cfg, setCfg] = useState<UserConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [selectedProvider, setSelectedProvider] = useState<ProviderId>('google')
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('')
  const [mode, setMode] = useState<'fast' | 'full'>('fast')

  useEffect(() => {
    fetch('/api/config')
      .then(r => r.json())
      .then(data => {
        setCfg(data)
        if (data.activeProvider) {
          setSelectedProvider(data.activeProvider)
          const provider = data.providers?.[data.activeProvider]
          if (provider) {
            setModel(provider.model || '')
          }
        }
        setMode(data.mode || 'fast')
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const models = PROVIDER_MODELS[selectedProvider]
    if (models && models.length > 0 && !model) {
      setModel(models[0].id)
    }
  }, [selectedProvider])

  async function saveProvider() {
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      const body = {
        activeProvider: selectedProvider,
        provider: { 
          id: selectedProvider,
          apiKey: apiKey || undefined,
          model: model
        },
        mode
      }

      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      const text = await res.text()
      
      if (!res.ok) {
        let errorMsg = 'Failed to save'
        try {
          const data = JSON.parse(text)
          errorMsg = data.error || errorMsg
        } catch {}
        throw new Error(errorMsg)
      }
      
      setSuccess(true)
      setApiKey('')
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError((err as Error).message)
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="skeleton h-8 w-48" />
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Configure your AI provider and preferences.
        </p>
      </div>

      <div className="card-soft p-5 sm:p-6 space-y-5">
        <h2 className="font-semibold text-lg">AI Provider</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.keys(PROVIDER_LABELS) as ProviderId[]).map(pid => (
            <button
              key={pid}
              type="button"
              onClick={() => setSelectedProvider(pid)}
              className={`p-3 rounded-lg border text-sm font-medium transition ${
                selectedProvider === pid
                  ? 'border-amber-500/60 bg-amber-500/5'
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {PROVIDER_LABELS[pid]}
            </button>
          ))}
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Model</label>
            <select
              className="input"
              value={model}
              onChange={e => setModel(e.target.value)}
            >
              {PROVIDER_MODELS[selectedProvider]?.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-zinc-400 mb-1 block">
              API Key 
              {cfg?.providers?.[selectedProvider]?.hasKey && 
                <span className="text-emerald-500 ml-2">(saved)</span>
              }
            </label>
            <input
              className="input"
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder={apiKey ? '••••••••' : 'Enter your API key'}
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Mode</label>
            <select
              className="input"
              value={mode}
              onChange={e => setMode(e.target.value as 'fast' | 'full')}
            >
              <option value="fast">Fast (cheapest, recommended)</option>
              <option value="full">Full (more thorough analysis)</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={saveProvider}
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            {success && (
              <span className="text-sm text-emerald-500 self-center">Settings saved!</span>
            )}
          </div>
          
          {error && (
            <div className="text-sm text-red-400 p-2 rounded bg-red-900/20">
              Error: {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}