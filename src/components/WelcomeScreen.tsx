import { useState } from 'react'
import { UserCircle2 } from 'lucide-react'
import { t } from '../lib/translations'
import { saveUserName } from '../lib/supabase'
import type { Language } from '../types'

interface Props {
  language: Language
  onComplete: (name: string) => void
}

export function WelcomeScreen({ language, onComplete }: Props) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError(t(language, 'nameRequired'))
      return
    }
    setLoading(true)
    // Fire-and-forget — never block the user on Supabase availability
    saveUserName(trimmed).catch(() => {})
    onComplete(trimmed)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-xl text-center">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <UserCircle2 size={52} className="text-blue-600" />
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {t(language, 'welcomeTitle')}
        </h1>
        <p className="text-xl text-gray-500 mb-8">{t(language, 'welcomeSubtitle')}</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError('') }}
            placeholder={t(language, 'namePlaceholder')}
            disabled={loading}
            className="w-full px-6 py-4 text-2xl border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors"
          />
          {error && <p className="text-red-500 text-lg">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-2xl font-semibold py-4 rounded-2xl transition-colors"
          >
            {loading ? t(language, 'loadingBtn') : t(language, 'startBtn')}
          </button>
        </form>
      </div>
    </div>
  )
}
