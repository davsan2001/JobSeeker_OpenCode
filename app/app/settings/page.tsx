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
  const [success, setSuccess] = useState<string | null>(null)

  const [selectedProvider, setSelectedProvider] = useState<ProviderId>('google')
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('')
  const [mode, setMode] = useState<'fast' | 'full'>('fast')

  const [cvText, setCvText] = useState('')
  const [cvStatus, setCvStatus] = useState<'none' | 'uploaded' | 'summarized'>('none')
  const [uploadingCv, setUploadingCv] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/config').then(r => r.json()),
      fetch('/api/cv').then(r => r.json()).catch(() => ({ hasRaw: false, summary: null }))
    ]).then(([configData, cvData]) => {
      setCfg(configData)
      if (configData.activeProvider) {
        setSelectedProvider(configData.activeProvider)
        const provider = configData.providers?.[configData.activeProvider]
        if (provider) {
          setModel(provider.model || '')
        }
      }
      setMode(configData.mode || 'fast')
      
      if (cvData.summary) {
        setCvStatus('summarized')
      } else if (cvData.hasRaw) {
        setCvStatus('uploaded')
      }
    }).catch(console.error)
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
    setSuccess(null)
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
      
      setSuccess('AI provider saved!')
      setApiKey('')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function uploadCv() {
    if (!cvText.trim() || cvText.length < 100) {
      setError('Please paste at least 100 characters of your CV')
      return
    }
    
    setUploadingCv(true)
    setError(null)
    
    try {
      const res = await fetch('/api/cv', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: cvText })
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to upload CV')
      }
      
      setCvStatus('uploaded')
      setSuccess('CV uploaded! Click "Summarize" to process it.')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setUploadingCv(false)
    }
  }

  if (loading) {
    return <div className="space-y-3"><div className="skeleton h-8 w-48" /><div className="skeleton h-32 w-full" /></div>
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Configure your AI provider and upload your CV to get started.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-900/20 border border-red-800 text-red-400 text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 rounded-lg bg-emerald-900/20 border border-emerald-800 text-emerald-400 text-sm">
          {success}
        </div>
      )}

      <div className="card-soft p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">AI Provider</h2>
          {cfg?.providers?.[selectedProvider]?.hasKey && (
            <span className="chip chip-ok text-xs">Configured</span>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.keys(PROVIDER_LABELS) as ProviderId[]).map(pid => (
            <button
              key={pid}
              type="button"
              onClick={() => {
                setSelectedProvider(pid)
                setModel(PROVIDER_MODELS[pid]?.[0]?.id || '')
              }}
              className={`p-3 rounded-lg border text-sm font-medium transition relative ${
                selectedProvider === pid
                  ? 'border-amber-500/60 bg-amber-500/5'
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {PROVIDER_LABELS[pid]}
              {cfg?.providers?.[pid]?.hasKey && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
              )}
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
            </label>
            <input
              className="input"
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="Enter your API key"
            />
            {cfg?.providers?.[selectedProvider]?.hasKey && (
              <p className="text-xs text-emerald-500 mt-1">API key saved</p>
            )}
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

          <button
            onClick={saveProvider}
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? 'Saving...' : 'Save AI Settings'}
          </button>
        </div>
      </div>

      <div className="card-soft p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Your CV</h2>
          {cvStatus === 'summarized' && (
            <span className="chip chip-ok text-xs">Ready</span>
          )}
          {cvStatus === 'uploaded' && (
            <span className="chip chip-warn text-xs">Needs summarize</span>
          )}
        </div>
        
        <p className="text-sm text-zinc-400">
          Upload your CV (PDF or text file). We'll extract the text, summarize it once, and reuse that summary for every application.
        </p>
        
        <div className="flex flex-wrap gap-3 items-center">
          <label className="btn btn-ghost cursor-pointer">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload PDF
            <input
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                
                setUploadingCv(true)
                setError(null)
                
                const formData = new FormData()
                formData.append('file', file)
                
                try {
                  const res = await fetch('/api/cv', {
                    method: 'POST',
                    body: formData
                  })
                  
                  if (!res.ok) {
                    const data = await res.json()
                    throw new Error(data.error || 'Failed to upload')
                  }
                  
                  setCvStatus('uploaded')
                  setSuccess('CV uploaded! Click "Summarize" to process it.')
                  setTimeout(() => setSuccess(null), 3000)
                } catch (err) {
                  setError((err as Error).message)
                } finally {
                  setUploadingCv(false)
                }
              }}
            />
          </label>
          <span className="text-xs text-zinc-500">or paste text below</span>
        </div>
        
        <textarea
          className="textarea min-h-[150px]"
          value={cvText}
          onChange={e => setCvText(e.target.value)}
          placeholder="Or paste your CV text here (at least 100 characters)..."
        />
        
        <div className="flex gap-3">
          <button
            onClick={uploadCv}
            disabled={uploadingCv || !cvText.trim()}
            className="btn btn-ghost"
          >
            {uploadingCv ? 'Processing...' : 'Save Text'}
          </button>
          
          {cvStatus === 'uploaded' && (
            <button
              onClick={async () => {
                setUploadingCv(true)
                try {
                  const res = await fetch('/api/cv', { method: 'PUT' })
                  if (!res.ok) throw new Error('Failed to summarize')
                  setCvStatus('summarized')
                  setSuccess('CV summarized! Ready to use.')
                  setTimeout(() => setSuccess(null), 3000)
                } catch (err) {
                  setError((err as Error).message)
                } finally {
                  setUploadingCv(false)
                }
              }}
              disabled={uploadingCv}
              className="btn btn-primary"
            >
              {uploadingCv ? 'Summarizing...' : 'Summarize CV'}
            </button>
          )}
        </div>
        
        {cvStatus === 'summarized' && (
          <p className="text-sm text-emerald-500">✓ Your CV is ready! You can now create job applications.</p>
        )}
      </div>
    </div>
  )
}