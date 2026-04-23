import { useState, useEffect, useRef, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { RotateCcw, ArrowLeft } from 'lucide-react'
import { t } from '../lib/translations'
import { getTrueFalseStatements } from '../data/wordBanks'
import type { AgeGroup, Language } from '../types'

interface Props {
  ageGroup: AgeGroup
  language: Language
  onComplete: (score: number) => void
  onBack: () => void
}

const TIME_PER_STATEMENT = 12
const STATEMENTS_PER_ROUND = 10

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function TrueOrFalse({ ageGroup, language, onComplete, onBack }: Props) {
  const [statements] = useState(() => shuffle(getTrueFalseStatements(ageGroup)).slice(0, STATEMENTS_PER_ROUND))

  const [index, setIndex]       = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_STATEMENT)
  const [answer, setAnswer]     = useState<boolean | null>(null)
  const [score, setScore]       = useState(0)
  const [streak, setStreak]     = useState(0)
  const [done, setDone]         = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const current = statements[index]

  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  function startTimer() {
    clearTimer()
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer()
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  useEffect(() => {
    if (!done) {
      setTimeLeft(TIME_PER_STATEMENT)
      setAnswer(null)
      startTimer()
    }
    return clearTimer
  }, [index, done]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => clearTimer(), [])

  function handleTimeout() {
    setAnswer(null)
    setStreak(0)
    // Show "time's up" state via a sentinel
    setAnswer(-1 as unknown as boolean)
    setTimeout(advance, 2800)
  }

  const handleAnswer = useCallback(
    (chosen: boolean) => {
      if (answer !== null) return
      clearTimer()
      setAnswer(chosen)

      if (chosen === current.isTrue) {
        const bonus = Math.ceil(timeLeft / 3)
        setScore((s) => s + 10 + bonus)
        setStreak((s) => s + 1)
        confetti({ particleCount: 70, spread: 55, origin: { y: 0.6 } })
      } else {
        setStreak(0)
      }
      setTimeout(advance, 2800)
    },
    [answer, current, timeLeft], // eslint-disable-line react-hooks/exhaustive-deps
  )

  function advance() {
    if (index + 1 >= statements.length) {
      setDone(true)
    } else {
      setIndex((i) => i + 1)
    }
  }

  function handleRestart() {
    setIndex(0)
    setScore(0)
    setStreak(0)
    setAnswer(null)
    setDone(false)
    setTimeLeft(TIME_PER_STATEMENT)
  }

  const maxScore = STATEMENTS_PER_ROUND * (10 + Math.ceil(TIME_PER_STATEMENT / 3))
  const pct = Math.min(100, Math.round((score / maxScore) * 100))

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex items-center justify-center p-8">
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
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xl font-semibold py-4 rounded-2xl transition-colors"
            >
              {t(language, 'continueBtn')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const timerPct = (timeLeft / TIME_PER_STATEMENT) * 100
  const timerColor =
    timerPct > 60 ? 'bg-green-500' : timerPct > 30 ? 'bg-amber-400' : 'bg-red-500'

  // Sentinel: -1 means timed out
  const timedOut = (answer as unknown as number) === -1
  const answered  = answer !== null && !timedOut

  const trueState = (): string => {
    if (!answered && !timedOut) return 'bg-emerald-500 text-white active:bg-emerald-600'
    if (current.isTrue) return 'bg-green-500 text-white ring-4 ring-green-300'
    if (answered && answer === true) return 'bg-red-500 text-white ring-4 ring-red-300'
    return 'bg-gray-200 text-gray-400'
  }

  const falseState = (): string => {
    if (!answered && !timedOut) return 'bg-rose-500 text-white active:bg-rose-600'
    if (!current.isTrue) return 'bg-green-500 text-white ring-4 ring-green-300'
    if (answered && answer === false) return 'bg-red-500 text-white ring-4 ring-red-300'
    return 'bg-gray-200 text-gray-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 max-w-2xl mx-auto w-full">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-lg"
        >
          <ArrowLeft size={22} /> {t(language, 'back')}
        </button>
        <div className="flex items-center gap-4 text-gray-600 text-lg">
          {streak >= 3 && <span className="text-amber-500 font-bold">🔥 {streak}</span>}
          <span>⭐ {score}</span>
          <span>{index + 1} / {statements.length}</span>
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
          {answered || timedOut ? '—' : timeLeft}
        </div>

        {/* Statement card */}
        <div className="bg-white rounded-3xl shadow-lg px-8 py-8 w-full text-center">
          <p className="text-2xl font-semibold text-gray-800 leading-snug">
            {current.statement}
          </p>
        </div>

        {/* TRUE / FALSE buttons */}
        <div className="grid grid-cols-2 gap-6 w-full">
          <button
            onClick={() => handleAnswer(true)}
            disabled={answer !== null}
            className={`${trueState()} rounded-3xl py-10 text-4xl font-black shadow-xl active:scale-95 transition-all select-none`}
          >
            ✅ TRUE
          </button>
          <button
            onClick={() => handleAnswer(false)}
            disabled={answer !== null}
            className={`${falseState()} rounded-3xl py-10 text-4xl font-black shadow-xl active:scale-95 transition-all select-none`}
          >
            ❌ FALSE
          </button>
        </div>

        {timedOut && (
          <p className="text-red-500 font-bold text-xl">
            ⏱ Time's up! Answer was: {current.isTrue ? 'TRUE' : 'FALSE'}
          </p>
        )}
      </div>
    </div>
  )
}
