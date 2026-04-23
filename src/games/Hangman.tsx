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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ---------------------------------------------------------------------------
// SVG Hangman drawing — builds progressively with wrong guesses
// ---------------------------------------------------------------------------
function HangmanDrawing({ wrongCount }: { wrongCount: number }) {
  const dead = wrongCount >= MAX_WRONG
  const bodyColor = dead ? '#ef4444' : '#3b82f6'

  return (
    <svg viewBox="0 0 200 210" className="w-40 h-40 sm:w-48 sm:h-48">
      {/* Gallows */}
      <line x1="20" y1="190" x2="180" y2="190" stroke="#374151" strokeWidth="5" strokeLinecap="round" />
      <line x1="60" y1="190" x2="60" y2="15"  stroke="#374151" strokeWidth="5" strokeLinecap="round" />
      <line x1="60" y1="15"  x2="135" y2="15" stroke="#374151" strokeWidth="5" strokeLinecap="round" />
      <line x1="135" y1="15" x2="135" y2="42" stroke="#374151" strokeWidth="3" strokeLinecap="round" />

      {/* Head */}
      {wrongCount >= 1 && (
        <circle cx="135" cy="58" r="16" stroke={bodyColor} strokeWidth="3" fill="none" />
      )}
      {/* Body */}
      {wrongCount >= 2 && (
        <line x1="135" y1="74" x2="135" y2="132" stroke={bodyColor} strokeWidth="3" strokeLinecap="round" />
      )}
      {/* Left arm */}
      {wrongCount >= 3 && (
        <line x1="135" y1="90" x2="112" y2="114" stroke={bodyColor} strokeWidth="3" strokeLinecap="round" />
      )}
      {/* Right arm */}
      {wrongCount >= 4 && (
        <line x1="135" y1="90" x2="158" y2="114" stroke={bodyColor} strokeWidth="3" strokeLinecap="round" />
      )}
      {/* Left leg */}
      {wrongCount >= 5 && (
        <line x1="135" y1="132" x2="112" y2="162" stroke={bodyColor} strokeWidth="3" strokeLinecap="round" />
      )}
      {/* Right leg */}
      {wrongCount >= 6 && (
        <line x1="135" y1="132" x2="158" y2="162" stroke={bodyColor} strokeWidth="3" strokeLinecap="round" />
      )}

      {/* X eyes when dead */}
      {dead && (
        <>
          <line x1="128" y1="52" x2="132" y2="56" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <line x1="132" y1="52" x2="128" y2="56" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <line x1="138" y1="52" x2="142" y2="56" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <line x1="142" y1="52" x2="138" y2="56" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
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
  const [guessed, setGuessed] = useState<Set<string>>(new Set())
  const [wrongCount, setWrongCount] = useState(0)
  const [wordResult, setWordResult] = useState<'won' | 'lost' | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const advancing = useRef(false)

  const current = words[wordIndex]
  const word = current.word
  const lettersInWord = new Set(word.split(''))
  const allRevealed = [...lettersInWord].every((l) => guessed.has(l))

  // Detect win / lose
  useEffect(() => {
    if (wordResult !== null || advancing.current) return

    if (allRevealed) {
      const pts = Math.max(0, 10 - wrongCount)
      setScore((s) => s + pts)
      setWordResult('won')
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } })
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
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 flex items-center justify-center p-8">
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
            {score} / {maxScore} points
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
              <RotateCcw size={22} /> Play Again
            </button>
            <button
              onClick={() => onComplete(Math.max(10, pct))}
              className="flex-1 bg-slate-700 hover:bg-slate-800 text-white text-xl font-semibold py-4 rounded-2xl transition-colors"
            >
              {t(language, 'continueBtn')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const remainingGuesses = MAX_WRONG - wrongCount

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 flex flex-col p-4">
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
        {/* Drawing + stats row */}
        <div className="flex items-center justify-between w-full bg-white rounded-3xl shadow px-6 py-4">
          <HangmanDrawing wrongCount={wrongCount} />

          <div className="flex flex-col items-center gap-3 flex-1">
            {/* Wrong guesses remaining */}
            <div
              className={`text-5xl font-black tabular-nums ${
                remainingGuesses <= 2 ? 'text-red-500 animate-pulse' : 'text-gray-700'
              }`}
            >
              {remainingGuesses}
            </div>
            <p className="text-sm text-gray-400 font-medium uppercase tracking-wide">
              {remainingGuesses === 1 ? 'guess left' : 'guesses left'}
            </p>

            {/* Wrong letter chips */}
            <div className="flex flex-wrap justify-center gap-1 max-w-[160px]">
              {[...guessed]
                .filter((l) => !lettersInWord.has(l))
                .map((l) => (
                  <span
                    key={l}
                    className="inline-block bg-red-100 text-red-500 text-sm font-bold rounded-lg px-2 py-0.5"
                  >
                    {l}
                  </span>
                ))}
            </div>
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
            const showRed = wordResult === 'lost' && !revealed
            return (
              <div
                key={i}
                className={`w-11 h-12 flex items-end justify-center border-b-4 transition-colors ${
                  showRed
                    ? 'border-red-400'
                    : revealed
                    ? 'border-green-400'
                    : 'border-gray-400'
                }`}
              >
                <span
                  className={`text-2xl font-bold mb-0.5 ${
                    showRed
                      ? 'text-red-500'
                      : revealed
                      ? 'text-gray-800'
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
              ? `✅ +${Math.max(0, 10 - wrongCount)} points!`
              : `💀 The word was: ${word}`}
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
                    : 'bg-white shadow text-gray-800 hover:bg-indigo-50 active:bg-indigo-100'
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
