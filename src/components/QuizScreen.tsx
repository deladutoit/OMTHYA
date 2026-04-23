import { useState } from 'react'
import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-react'
import { t } from '../lib/translations'
import type { Language, Lesson } from '../types'

interface Props {
  language: Language
  lesson: Lesson
  onComplete: (score: number) => void
  onBack: () => void
}

type AnswerState = 'idle' | 'correct' | 'wrong'

export function QuizScreen({ language, lesson, onComplete, onBack }: Props) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [, setState] = useState<AnswerState>('idle')
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const questions = lesson.questions
  const current = questions[index]
  const correctIndex = current.options.indexOf(current.answer)

  function handleSelect(i: number) {
    if (selected !== null) return
    setSelected(i)
    const isCorrect = current.options[i] === current.answer
    setState(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore((s) => s + 1)

    setTimeout(() => {
      if (index < questions.length - 1) {
        setIndex((n) => n + 1)
        setSelected(null)
        setState('idle')
      } else {
        setDone(true)
      }
    }, 1800)
  }

  const pct = Math.round(((done ? score : score) / questions.length) * 100)
  const resultLabel =
    pct >= 80 ? t(language, 'greatJob')
    : pct >= 50 ? t(language, 'goodJob')
    : t(language, 'keepPractising')

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-xl text-center">
          <p className="text-6xl mb-4">{pct >= 80 ? '🌟' : pct >= 50 ? '🎉' : '💪'}</p>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{resultLabel}</h1>
          <p className="text-2xl text-gray-600 mb-8">
            {t(language, 'youScored')} {score} {t(language, 'outOf')} {questions.length}
            <span className="ml-3 text-xl text-gray-400">({pct}%)</span>
          </p>

          {/* Score bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-10">
            <div
              className={`h-4 rounded-full transition-all ${pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-400' : 'bg-orange-400'}`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <button
            onClick={() => onComplete(score)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-2xl font-semibold py-4 rounded-2xl transition-colors"
          >
            {t(language, 'continueBtn')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col p-8">
      <div className="w-full max-w-3xl mx-auto flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-xl"
          >
            <ArrowLeft size={24} /> {t(language, 'back')}
          </button>
          <span className="text-gray-500 text-lg">
            {t(language, 'question')} {index + 1} {t(language, 'of')} {questions.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((index) / questions.length) * 100}%` }}
          />
        </div>

        {/* Lesson title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">{lesson.lesson_title}</h1>
          <p className="text-lg text-gray-500">{t(language, 'checkKnowledge')}</p>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 flex-1 flex flex-col justify-between">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center leading-snug">
            {current.question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {current.options.map((option, i) => {
              const isSelected = selected === i
              const isCorrectOption = i === correctIndex

              let cls = 'p-5 text-xl font-semibold rounded-2xl transition-all text-left flex items-center gap-3 '
              if (selected === null) {
                cls += 'bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer'
              } else if (isCorrectOption) {
                cls += 'bg-green-500 text-white'
              } else if (isSelected) {
                cls += 'bg-red-500 text-white'
              } else {
                cls += 'bg-gray-100 text-gray-400 cursor-default'
              }

              return (
                <button key={i} onClick={() => handleSelect(i)} className={cls} disabled={selected !== null}>
                  {selected !== null && isCorrectOption && <CheckCircle2 size={22} className="shrink-0" />}
                  {selected !== null && isSelected && !isCorrectOption && <XCircle size={22} className="shrink-0" />}
                  <span>{option}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
