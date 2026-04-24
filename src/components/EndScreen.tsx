import { RotateCcw, BookOpen } from 'lucide-react'
import { t } from '../lib/translations'
import type { Language } from '../types'

interface Props {
  userName: string
  language: Language
  tokensEarned: number
  onContinue: () => void
  onRestart: () => void
}

export function EndScreen({ userName, language, tokensEarned, onContinue, onRestart }: Props) {
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
        <p className="text-lg text-gray-400 mb-6">{t(language, 'encouragement')}</p>

        {tokensEarned > 0 && (
          <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl px-6 py-4 mb-8 flex items-center justify-center gap-3">
            <span className="text-3xl">⚽</span>
            <p className="text-orange-700 text-xl font-bold">
              {t(language, 'soccerTokenEarned')}
            </p>
            <span className="text-3xl">⚽</span>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <button
            onClick={onContinue}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-2xl font-semibold py-4 rounded-2xl transition-colors flex items-center justify-center gap-3"
          >
            <BookOpen size={26} />
            {t(language, 'keepLearning')}
          </button>
          <button
            onClick={onRestart}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-xl font-semibold py-4 rounded-2xl transition-colors flex items-center justify-center gap-3"
          >
            <RotateCcw size={22} />
            {t(language, 'newSession')}
          </button>
        </div>
      </div>
    </div>
  )
}
