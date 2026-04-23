import { RotateCcw } from 'lucide-react'
import { t } from '../lib/translations'
import type { Language } from '../types'

interface Props {
  userName: string
  language: Language
  onRestart: () => void
}

export function EndScreen({ userName, language, onRestart }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-xl text-center">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">🏆</span>
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          {t(language, 'thankYou', { name: userName })}
        </h1>
        <p className="text-2xl text-gray-600 mb-3">{t(language, 'sessionComplete')}</p>
        <p className="text-lg text-gray-400 mb-10">{t(language, 'encouragement')}</p>

        <button
          onClick={onRestart}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-2xl font-semibold py-4 rounded-2xl transition-colors flex items-center justify-center gap-3"
        >
          <RotateCcw size={26} />
          {t(language, 'newSession')}
        </button>
      </div>
    </div>
  )
}
