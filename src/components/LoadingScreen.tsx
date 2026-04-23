import { Loader2 } from 'lucide-react'
import { t } from '../lib/translations'
import type { Language } from '../types'

interface Props {
  language: Language
}

export function LoadingScreen({ language }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center gap-8 p-8">
      <Loader2 size={72} className="text-blue-500 animate-spin" />
      <p className="text-3xl font-semibold text-gray-700">{t(language, 'generatingLesson')}</p>
    </div>
  )
}
