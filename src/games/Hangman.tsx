import { useState, useEffect, useRef, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { RotateCcw, ArrowLeft } from 'lucide-react'
import { t } from '../lib/translations'
import { getScrambleWords } from '../data/wordBanks'
import type { Language } from '../types'

interface Props {
  language: Language
  onComplete: (score: number) => void
  onBack: () => void
}

const MAX_WRONG = 6
const WORDS_PER_ROUND = 8
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const BALLOON_COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#22c55e', '#a855f7', '#f97316']
const CX = [28, 78, 128, 178, 228, 278]
const CY = 40
const R  = 22

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ---------------------------------------------------------------------------
// Balloon row — pops left-to-right as wrong guesses accumulate
// ---------------------------------------------------------------------------
function BalloonDisplay({ wrongCount }: { wrongCount: number }) {
  return (
    <svg viewBox="0 0 306 115" className="w-full max-w-sm mx-auto">
      {CX.map((cx, i) => {
        const popped = i < wrongCount
        const color  = BALLOON_COLORS[i]

        if (popped) {
          return (
            <g key={i} opacity="0.45">
              {/* Burst cross */}
              <line x1={cx - 11} y1={CY - 11} x2={cx + 11} y2={CY + 11} stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
              <line x1={cx + 11} y1={CY - 11} x2={cx - 11} y2={CY + 11} stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
              <line x1={cx - 13} y1={CY} x2={cx + 13} y2={CY} stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
              <line x1={cx} y1={CY - 13} x2={cx} y2={CY + 13} stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
              {/* Limp string */}
              <path d={`M${cx} ${CY + 8} Q${cx + 6} ${CY + 40} ${cx - 2} ${CY + 70}`} fill="none" stroke="#d1d5db" strokeWidth="1.5" />
            </g>
          )
        }

        return (
          <g key={i}>
            {/* Shadow */}
            <ellipse cx={cx} cy={CY + R + 2} rx={R * 0.7} ry={4} fill="rgba(0,0,0,0.08)" />
            {/* Balloon body */}
            <circle cx={cx} cy={CY} r={R} fill={color} />
            {/* Shine highlight */}
            <circle cx={cx - 7} cy={CY - 8} r={6} fill="white" opacity="0.3" />
            {/* Knot */}
            <polygon
              points={`${cx},${CY + R} ${cx - 3},${CY + R + 7} ${cx + 3},${CY + R + 7}`}
              fill={color}
            />
            {/* String */}
            <path
              d={`M${cx} ${CY + R + 7} Q${cx + 5} ${CY + R + 35} ${cx - 2} ${CY + R + 62}`}
              fill="none"
              stroke="#9ca3af"
              strokeWidth="1.5"
            />
          </g>
        )
      })}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Main game component
// ---------------------------------------------------------------------------
export function Hangman({ language, onComplete, onBack }: Props) {
  const [words] = useState(() =>
    shuffle(getScrambleWords('teen')).slice(0, WORDS_PER_ROUND),
  )
  const [wordIndex, setWordIndex] = useState(0)
  const [guessed, setGuessed]     = useState<Set<string>>(new Set())
  const [wrongCount, setWrongCount] = useState(0)
  const [wordResult, setWordResult] = useState<'won' | 'lost' | null>(null)
  const [score, setScore]         = useState(0)
  const [done, setDone]           = useState(false)
  const advancing = useRef(false)

  const current      = words[wordIndex]
  const word         = current.word
  const lettersInWord = new Set(word.split(''))
  const allRevealed  = [...lettersInWord].every((l) => guessed.has(l))

  // Detect win / lose
  useEffect(() => {
    if (wordResult !== null || advancing.current) return

    if (allRevealed) {
      const pts = Math.max(0, 10 - wrongCount)
      setScore((s) => s + pts)
      setWordResult('won')
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } })
    } else if (wrongCount >= MAX_WRONG) {
      setWordResult('lost')
    }
  }, [allRevealed, wrongCount, wordResult])

  // Auto-advance after result is shown
  useEffect(() => {
    if (wordResult === null) return
    advancing.current = true

    const timer = setTimeout(() => {
      advancing.current = false
      if (wordIndex + 1 >= words.length) {
        setDone(true)
      } else {
        setWordIndex((i) => i + 1)
        setGuessed(new Set())
        setWrongCount(0)
        setWordResult(null)
      }
    }, 2800)

    return () => {
      clearTimeout(timer)
      advancing.current = false
    }
  }, [wordResult, wordIndex, words.length])

  const handleLetterTap = useCallback(
    (letter: string) => {
      if (wordResult !== null || guessed.has(letter)) return
      const next = new Set(guessed)
      next.add(letter)
      setGuessed(next)
      if (!word.includes(letter)) {
        setWrongCount((c) => c + 1)
      }
    },
    [wordResult, guessed, word],
  )

  function handleRestart() {
    setWordIndex(0)
    setGuessed(new Set())
    setWrongCount(0)
    setWordResult(null)
    setScore(0)
    setDone(false)
    advancing.current = false
  }

  const maxScore = WORDS_PER_ROUND * 10
  const pct = Math.min(100, Math.round((score / maxScore) * 100))

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-lg text-center">
          <p className="text-7xl mb-4">{pct >= 70 ? '🌟' : pct >= 40 ? '🎉' : '💪'}</p>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {pct >= 70
              ? t(language, 'greatJob')
              : pct >= 40
              ? t(language, 'goodJob')
              : t(language, 'keepPractising')}
          </h1>
          <p className="text-xl text-gray-500 mb-2">
            {score} / {maxScore} {t(language, 'points')}
          </p>
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
              <RotateCcw size={22} /> {t(language, 'playAgain')}
            </button>
            <button
              onClick={() => onComplete(Math.max(10, pct))}
              className="flex-1 bg-sky-600 hover:bg-sky-700 text-white text-xl font-semibold py-4 rounded-2xl transition-colors"
            >
              {t(language, 'continueBtn')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const remaining = MAX_WRONG - wrongCount

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 max-w-2xl mx-auto w-full">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-lg"
        >
          <ArrowLeft size={22} /> {t(language, 'back')}
        </button>
        <div className="flex items-center gap-4 text-gray-600 text-base font-medium">
          <span>⭐ {score}</span>
          <span>{wordIndex + 1} / {words.length}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center gap-4 max-w-2xl mx-auto w-full">
        {/* Balloon display card */}
        <div className="w-full bg-white rounded-3xl shadow px-4 pt-4 pb-2">
          <BalloonDisplay wrongCount={wrongCount} />
          <div className="flex items-center justify-between px-2 pb-1 mt-1">
            <div className="flex flex-wrap gap-1">
              {[...guessed]
                .filter((l) => !lettersInWord.has(l))
                .map((l) => (
                  <span
                    key={l}
                    className="inline-block bg-red-100 text-red-400 text-xs font-bold rounded-lg px-2 py-0.5"
                  >
                    {l}
                  </span>
                ))}
            </div>
            <span
              className={`text-lg font-bold tabular-nums ${
                remaining <= 2 ? 'text-red-500 animate-pulse' : 'text-gray-500'
              }`}
            >
              {t(language, 'balloonsLeft', { n: remaining.toString() })}
            </span>
          </div>
        </div>

        {/* Hint */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-3 w-full text-center">
          <p className="text-indigo-700 font-medium text-base">{current.hint}</p>
        </div>

        {/* Word blanks */}
        <div className="flex flex-wrap justify-center gap-2 w-full">
          {word.split('').map((letter, i) => {
            const revealed = guessed.has(letter)
            const showRed  = wordResult === 'lost' && !revealed
            return (
              <div
                key={i}
                className={`w-11 h-12 flex items-end justify-center border-b-4 transition-colors ${
                  showRed    ? 'border-red-400'
                  : revealed ? 'border-green-400'
                             : 'border-gray-400'
                }`}
              >
                <span
                  className={`text-2xl font-bold mb-0.5 ${
                    showRed    ? 'text-red-500'
                    : revealed ? 'text-gray-800'
                               : 'text-transparent'
                  }`}
                >
                  {letter}
                </span>
              </div>
            )
          })}
        </div>

        {/* Result banner */}
        {wordResult && (
          <div
            className={`w-full rounded-2xl py-3 text-center text-xl font-bold ${
              wordResult === 'won'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {wordResult === 'won'
              ? t(language, 'pointsEarned', { n: String(Math.max(0, 10 - wrongCount)) })
              : t(language, 'wordWas', { word })}
          </div>
        )}

        {/* Alphabet grid */}
        <div className="flex flex-wrap justify-center gap-2 w-full pb-2">
          {ALPHABET.map((letter) => {
            const isGuessed = guessed.has(letter)
            const isCorrect = isGuessed && lettersInWord.has(letter)
            const isWrong   = isGuessed && !lettersInWord.has(letter)

            return (
              <button
                key={letter}
                onClick={() => handleLetterTap(letter)}
                disabled={isGuessed || wordResult !== null}
                className={`w-11 h-11 rounded-xl text-lg font-bold select-none transition-all active:scale-90 ${
                  isCorrect
                    ? 'bg-green-200 text-green-700'
                    : isWrong
                    ? 'bg-red-100 text-red-300 line-through'
                    : wordResult !== null
                    ? 'bg-gray-100 text-gray-300'
                    : 'bg-white shadow text-gray-800 hover:bg-sky-50 active:bg-sky-100'
                }`}
              >
                {letter}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
