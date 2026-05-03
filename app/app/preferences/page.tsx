'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type CareerPreferences = {
  desiredRoles: string[]
  locations: string[]
  remoteOk: boolean
  seniority: string | null
  employmentTypes: string[]
  minSalary: number | null
  salaryCurrency: string | null
  industriesToAvoid: string[]
  languages: string[]
  minMatchScore: number
  dailyApplyLimit: number | null
  dailyAutoSend: boolean
}

const SENIORITY_LEVELS = [
  { value: 'entry', label: 'Entry / Junior' },
  { value: 'mid', label: 'Mid-Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'principal', label: 'Principal' },
  { value: 'manager', label: 'Manager' }
]

const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' }
]

export default function PreferencesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [prefs, setPrefs] = useState<CareerPreferences>({
    desiredRoles: [],
    locations: [],
    remoteOk: true,
    seniority: null,
    employmentTypes: [],
    minSalary: null,
    salaryCurrency: 'USD',
    industriesToAvoid: [],
    languages: [],
    minMatchScore: 80,
    dailyApplyLimit: null,
    dailyAutoSend: false
  })
  
  const [desiredRoleInput, setDesiredRoleInput] = useState('')
  const [locationInput, setLocationInput] = useState('')

  useEffect(() => {
    fetch('/api/preferences')
      .then(r => r.json())
      .then(data => {
        setPrefs(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  function addRole() {
    const role = desiredRoleInput.trim()
    if (role && !prefs.desiredRoles.includes(role)) {
      setPrefs({ ...prefs, desiredRoles: [...prefs.desiredRoles, role] })
      setDesiredRoleInput('')
    }
  }

  function removeRole(role: string) {
    setPrefs({ ...prefs, desiredRoles: prefs.desiredRoles.filter(r => r !== role) })
  }

  function addLocation() {
    const loc = locationInput.trim()
    if (loc && !prefs.locations.includes(loc)) {
      setPrefs({ ...prefs, locations: [...prefs.locations, loc] })
      setLocationInput('')
    }
  }

  function removeLocation(loc: string) {
    setPrefs({ ...prefs, locations: prefs.locations.filter(l => l !== loc) })
  }

  function toggleEmploymentType(type: string) {
    const current = prefs.employmentTypes
    const newTypes = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type]
    setPrefs({ ...prefs, employmentTypes: newTypes })
  }

  async function save() {
    setSaving(true)
    setError(null)
    setSuccess(null)
    
    try {
      const res = await fetch('/api/preferences', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(prefs)
      })
      
      if (!res.ok) throw new Error('Failed to save')
      
      setSuccess('Preferences saved!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="space-y-3"><div className="skeleton h-8 w-48" /><div className="skeleton h-32 w-full" /></div>
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Career Preferences</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Tell us what you're looking for so we can find the best matches for you.
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
        <h2 className="font-semibold text-lg">Desired Roles</h2>
        
        <div className="flex flex-wrap gap-2">
          {prefs.desiredRoles.map(role => (
            <button
              key={role}
              onClick={() => removeRole(role)}
              className="chip chip-remove"
            >
              {role} ×
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <input
            className="input flex-1"
            value={desiredRoleInput}
            onChange={e => setDesiredRoleInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addRole())}
            placeholder="e.g. Gameplay Programmer, Game Developer, UX Engineer..."
          />
          <button onClick={addRole} className="btn btn-ghost">Add</button>
        </div>
      </div>

      <div className="card-soft p-5 sm:p-6 space-y-5">
        <h2 className="font-semibold text-lg">Locations</h2>
        
        <div className="flex flex-wrap gap-2">
          {prefs.locations.map(loc => (
            <button
              key={loc}
              onClick={() => removeLocation(loc)}
              className="chip chip-remove"
            >
              {loc} ×
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <input
            className="input flex-1"
            value={locationInput}
            onChange={e => setLocationInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLocation())}
            placeholder="e.g. Remote, USA, Europe, LATAM..."
          />
          <button onClick={addLocation} className="btn btn-ghost">Add</button>
        </div>
        
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={prefs.remoteOk}
            onChange={e => setPrefs({ ...prefs, remoteOk: e.target.checked })}
            className="checkbox"
          />
          <span>Open to remote work</span>
        </label>
      </div>

      <div className="card-soft p-5 sm:p-6 space-y-5">
        <h2 className="font-semibold text-lg">Experience Level</h2>
        
        <div>
          <label className="text-xs text-zinc-400 mb-2 block">Seniority</label>
          <div className="flex flex-wrap gap-2">
            {SENIORITY_LEVELS.map(level => (
              <button
                key={level.value}
                onClick={() => setPrefs({ ...prefs, seniority: level.value })}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
                  prefs.seniority === level.value
                    ? 'border-amber-500/60 bg-amber-500/5'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="text-xs text-zinc-400 mb-2 block">Employment Type</label>
          <div className="flex flex-wrap gap-2">
            {EMPLOYMENT_TYPES.map(type => (
              <button
                key={type.value}
                onClick={() => toggleEmploymentType(type.value)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
                  prefs.employmentTypes.includes(type.value)
                    ? 'border-amber-500/60 bg-amber-500/5'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card-soft p-5 sm:p-6 space-y-5">
        <h2 className="font-semibold text-lg">Compensation</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Minimum Salary</label>
            <input
              type="number"
              className="input"
              value={prefs.minSalary || ''}
              onChange={e => setPrefs({ ...prefs, minSalary: e.target.value ? parseInt(e.target.value) : null })}
              placeholder="e.g. 50000"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Currency</label>
            <select
              className="input"
              value={prefs.salaryCurrency || 'USD'}
              onChange={e => setPrefs({ ...prefs, salaryCurrency: e.target.value })}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="COP">COP</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card-soft p-5 sm:p-6 space-y-5">
        <h2 className="font-semibold text-lg">Match Settings</h2>
        
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Minimum Match Score</label>
          <input
            type="range"
            min="50"
            max="100"
            step="5"
            value={prefs.minMatchScore}
            onChange={e => setPrefs({ ...prefs, minMatchScore: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="text-sm text-zinc-400 mt-1">{prefs.minMatchScore}% match required</div>
        </div>
        
        {prefs.dailyApplyLimit !== null && (
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Daily Auto-Apply Limit</label>
            <input
              type="number"
              className="input"
              value={prefs.dailyApplyLimit || ''}
              onChange={e => setPrefs({ ...prefs, dailyApplyLimit: e.target.value ? parseInt(e.target.value) : null })}
              placeholder="e.g. 10"
            />
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={save} disabled={saving} className="btn btn-primary">
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
        <button onClick={() => router.back()} className="btn btn-ghost">
          Back
        </button>
      </div>
    </div>
  )
}