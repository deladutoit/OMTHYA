import { useState, useEffect, useRef, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { RotateCcw, ArrowLeft } from 'lucide-react'
import { t } from '../lib/translations'
import { getQuickTapQuestions } from '../data/wordBanks'
import type { AgeGroup, Language } from '../types'

interface Props {
  ageGroup: AgeGroup
  language: Language
  onComplete: (score: number) => void
  onBack: () => void
}

const TIME_PER_QUESTION = 15 // seconds
const QUESTIONS_PER_ROUND = 10

const OPTION_COLORS = [
  { base: 'bg-rose-500',   active: 'active:bg-rose-600',   text: 'text-white' },
  { base: 'bg-sky-500',    active: 'active:bg-sky-600',    text: 'text-white' },
  { base: 'bg-amber-400',  active: 'active:bg-amber-500',  text: 'text-white' },
  { base: 'bg-emerald-500',active: 'active:bg-emerald-600',text: 'text-white' },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function QuickTap({ ageGroup, language, onComplete, onBack }: Props) {
  const [questions] = useState(() => shuffle(getQuickTapQuestions(ageGroup)).slice(0, QUESTIONS_PER_ROUND))

  const [index, setIndex]       = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore]       = useState(0)
  const [streak, setStreak]     = useState(0)
  const [done, setDone]         = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const current = questions[index]

  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  function startTimer() {
    clearTimer()
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearTimer()
          handleTimeout()
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  useEffect(() => {
    if (!done) {
      setTimeLeft(TIME_PER_QUESTION)
      setSelected(null)
      startTimer()
    }
    return clearTimer
  }, [index, done]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => clearTimer(), [])

  function handleTimeout() {
    setSelected('__timeout__')
    setStreak(0)
    setTimeout(advance, 2500)
  }

  const handleSelect = useCallback(
    (option: string) => {
      if (selected) return
      clearTimer()
      setSelected(option)

      if (option === current.answer) {
        const bonus = Math.ceil(timeLeft / 3)
        setScore((s) => s + 10 + bonus)
        setStreak((s) => s + 1)
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.5 } })
      } else {
        setStreak(0)
      }
      setTimeout(advance, 2500)
    },
    [selected, current, timeLeft], // eslint-disable-line react-hooks/exhaustive-deps
  )

  function advance() {
    if (index + 1 >= questions.length) {
      setDone(true)
    } else {
      setIndex((i) => i + 1)
    }
  }

  function handleRestart() {
    setIndex(0)
    setScore(0)
    setStreak(0)
    setSelected(null)
    setDone(false)
    setTimeLeft(TIME_PER_QUESTION)
  }

  const maxScore = QUESTIONS_PER_ROUND * (10 + Math.ceil(TIME_PER_QUESTION / 3))
  const pct = Math.min(100, Math.round((score / maxScore) * 100))

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-lg text-center">
          <p className="text-7xl mb-4">{pct >= 70 ? '🌟' : pct >= 40 ? '🎉' : '💪'}</p>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {pct >= 70
              ? t(language, 'greatJob')
              : pct >= 40
              ? t(language, 'goodJob')
              : t(language, 'keepPractising')}
          </h1>
          <p className="text-xl text-gray-500 mb-2">{score} points</p>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
            <div
              className={`h-4 rounded-full transition-all ${
                pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-400' : 'bg-orange-400'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleRestart}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xl font-semibold py-4 rounded-2xl transition-colors"
            >
              <RotateCcw size={22} /> Play Again
            </button>
            <button
              onClick={() => onComplete(Math.max(10, pct))}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-xl font-semibold py-4 rounded-2xl transition-colors"
            >
              {t(language, 'continueBtn')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const timerPct = (timeLeft / TIME_PER_QUESTION) * 100
  const timerColor =
    timerPct > 60 ? 'bg-green-500' : timerPct > 30 ? 'bg-amber-400' : 'bg-red-500'

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 max-w-2xl mx-auto w-full">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-lg"
        >
          <ArrowLeft size={22} /> {t(language, 'back')}
        </button>
        <div className="flex items-center gap-4 text-gray-600 text-lg">
          {streak >= 3 && (
            <span className="text-amber-500 font-bold">🔥 {streak}</span>
          )}
          <span>⭐ {score}</span>
          <span>{index + 1} / {questions.length}</span>
        </div>
      </div>

      {/* Timer bar */}
      <div className="w-full max-w-2xl mx-auto bg-gray-200 rounded-full h-4 mb-6">
        <div
          className={`h-4 rounded-full transition-all duration-1000 ${timerColor}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 max-w-2xl mx-auto w-full">
        {/* Countdown */}
        <div
          className={`text-6xl font-black tabular-nums transition-colors ${
            timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-700'
          }`}
        >
          {selected ? '—' : timeLeft}
        </div>

        {/* Question */}
        <div className="bg-white rounded-3xl shadow-lg px-8 py-6 w-full text-center">
          <p className="text-3xl font-bold text-gray-800">{current.question}</p>
        </div>

        {/* 2×2 option grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {current.options.map((option, i) => {
            const col = OPTION_COLORS[i % 4]
            const isCorrect = option === current.answer
            const isChosen  = option === selected

            let cls = `${col.base} ${col.text} ${col.active}`
            if (selected) {
              if (isCorrect) cls = 'bg-green-500 text-white ring-4 ring-green-300'
              else if (isChosen) cls = 'bg-red-500 text-white ring-4 ring-red-300'
              else cls = 'bg-gray-200 text-gray-400'
            }

            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                disabled={!!selected}
                className={`${cls} rounded-2xl py-6 text-2xl font-bold shadow-lg active:scale-95 transition-all select-none`}
              >
                {option}
              </button>
            )
          })}
        </div>

        {selected === '__timeout__' && (
          <p className="text-red-500 font-bold text-xl">
            ⏱ Time's up! Answer: {current.answer}
          </p>
        )}
      </div>
    </div>
  )
}
