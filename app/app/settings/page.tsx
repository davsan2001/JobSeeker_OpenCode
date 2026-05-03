'use client'

import { useEffect, useState } from 'react'
import { Help } from '@/components/Help'
import type { UserConfig } from '@/lib/types'
import type { ProviderId } from '@/lib/llm/types'

interface ProviderInfo {
  id: ProviderId
  displayName: string
  requiresApiKey: boolean
  defaultModels: { id: string; label: string }[]
}

export default function SettingsPage() {
  const [cfg, setCfg] = useState<UserConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const [selectedProvider, setSelectedProvider] = useState<ProviderId>('anthropic')
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('')

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
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function saveProvider() {
    setSaving(true)
    setMessage(null)
    try {
      const body: Record<string, unknown> = {
        provider: { id: selectedProvider },
        mode: cfg?.mode || 'fast'
      }
      if (apiKey) {
        (body.provider as Record<string, unknown>).apiKey = apiKey
      }
      if (model) {
        (body.provider as Record<string, unknown>).model = model
      }

      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error('Failed to save')
      setMessage('Settings saved!')
      setApiKey('')
    } catch (err) {
      setMessage((err as Error).message)
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
          {(['anthropic', 'google', 'openai', 'groq', 'ollama'] as ProviderId[]).map(pid => (
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
              {pid === 'anthropic' && 'Anthropic (Claude)'}
              {pid === 'google' && 'Google Gemini'}
              {pid === 'openai' && 'OpenAI GPT'}
              {pid === 'groq' && 'Groq'}
              {pid === 'ollama' && 'Ollama (Local)'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Model</label>
            <input
              className="input"
              value={model}
              onChange={e => setModel(e.target.value)}
              placeholder="e.g., claude-haiku-4-5-20251001"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 mb-1 block">API Key {cfg?.providers?.[selectedProvider]?.hasKey && '(saved)'}</label>
            <input
              className="input"
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder={apiKey ? '••••••••' : 'Enter your API key'}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={saveProvider}
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            {message && (
              <span className="text-sm text-zinc-400 self-center">{message}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}