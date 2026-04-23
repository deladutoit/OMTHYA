import { BookOpen, Calculator, Globe, ArrowLeft } from 'lucide-react'
import { t } from '../lib/translations'
import type { AgeGroup, Subject, Language } from '../types'

interface Props {
  ageGroup: AgeGroup
  language: Language
  onSubjectSelect: (subject: Subject) => void
  onBack: () => void
  error?: string | null
}

import type { T } from '../lib/translations'

const AGE_LABEL: Record<AgeGroup, { label: keyof T; ages: keyof T }> = {
  'early-learners': { label: 'earlyLearners', ages: 'earlyLearnersAges' },
  'primary':        { label: 'primary',       ages: 'primaryAges' },
  'teen':           { label: 'teen',          ages: 'teenAges' },
}

export function SubjectScreen({ ageGroup, language, onSubjectSelect, onBack, error }: Props) {
  const { label, ages } = AGE_LABEL[ageGroup]

  const subjects: { id: Subject; title: string; desc: string; icon: typeof BookOpen; bg: string }[] = [
    { id: 'english',          title: t(language, 'english'),          desc: t(language, 'englishDesc'),          icon: BookOpen,    bg: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'math',             title: t(language, 'math'),             desc: t(language, 'mathDesc'),             icon: Calculator,  bg: 'bg-emerald-500 hover:bg-emerald-600' },
    { id: 'general-knowledge',title: t(language, 'generalKnowledge'), desc: t(language, 'generalKnowledgeDesc'), icon: Globe,       bg: 'bg-purple-500 hover:bg-purple-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col p-8">
      <div className="w-full max-w-5xl mx-auto flex flex-col flex-1">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-xl mb-8 self-start"
        >
          <ArrowLeft size={24} /> {t(language, 'back')}
        </button>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            {t(language, label)} · {t(language, ages)}
          </h1>
          <p className="text-2xl text-gray-500">{t(language, 'chooseSubject')}</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 rounded-2xl px-6 py-4 mb-6 text-center text-xl">
            {t(language, 'lessonError')}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
          {subjects.map(({ id, title, desc, icon: Icon, bg }) => (
            <button
              key={id}
              onClick={() => onSubjectSelect(id)}
              className={`${bg} text-white p-8 rounded-3xl shadow-xl transition-transform hover:scale-105 active:scale-95 flex flex-col items-center gap-4`}
            >
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Icon size={44} />
              </div>
              <p className="text-3xl font-bold">{title}</p>
              <p className="text-xl opacity-90">{desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
