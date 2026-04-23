import { useState, useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { RotateCcw, ArrowLeft, Lightbulb } from 'lucide-react'
import { t } from '../lib/translations'
import { getScrambleWords } from '../data/wordBanks'
import type { AgeGroup, Language } from '../types'

interface Props {
  ageGroup: AgeGroup
  language: Language
  onComplete: (score: number) => void
  onBack: () => void
}

function shuffleWord(word: string): string[] {
  const letters = word.split('')
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[letters[i], letters[j]] = [letters[j], letters[i]]
  }
  // Never return in correct order accidentally
  if (letters.join('') === word && word.length > 1) return shuffleWord(word)
  return letters
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function WordScramble({ ageGroup, language, onComplete, onBack }: Props) {
  const allWords = shuffle(getScrambleWords(ageGroup)).slice(0, 8)
  const [index, setIndex] = useState(0)
  const [pool, setPool] = useState<string[]>(() => shuffleWord(allWords[0].word))
  const [answer, setAnswer] = useState<string[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)

  const current = allWords[index]

  // Reset letter pool when moving to a new word
  useEffect(() => {
    if (!done) {
      setPool(shuffleWord(allWords[index].word))
      setAnswer([])
      setFeedback(null)
    }
  }, [index]) // eslint-disable-line react-hooks/exhaustive-deps

  const tapPoolLetter = useCallback(
    (i: number) => {
      if (feedback) return
      const letter = pool[i]
      setPool((p) => p.filter((_, idx) => idx !== i))
      setAnswer((a) => [...a, letter])
    },
    [pool, feedback],
  )

  const tapAnswerLetter = useCallback(
    (i: number) => {
      if (feedback) return
      const letter = answer[i]
      setAnswer((a) => a.filter((_, idx) => idx !== i))
      setPool((p) => [...p, letter])
    },
    [answer, feedback],
  )

  const handleCheck = useCallback(() => {
    if (answer.length !== current.word.length) return
    const attempt = answer.join('')
    if (attempt === current.word) {
      setFeedback('correct')
      const pts = hintsUsed > 0 ? 5 : 10
      setScore((s) => s + pts)
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } })
      setTimeout(() => advance(), 1200)
    } else {
      setFeedback('wrong')
      setTimeout(() => {
        setFeedback(null)
        setPool(shuffleWord(current.word))
        setAnswer([])
      }, 900)
    }
  }, [answer, current, hintsUsed]) // eslint-disable-line react-hooks/exhaustive-deps

  function advance() {
    if (index + 1 >= allWords.length) {
      setDone(true)
    } else {
      setHintsUsed(0)
      setIndex((i) => i + 1)
    }
  }

  function handleSkip() {
    setFeedback(null)
    setHintsUsed(0)
    if (index + 1 >= allWords.length) {
      setDone(true)
    } else {
      setIndex((i) => i + 1)
    }
  }

  function handleHint() {
    if (feedback) return
    // Reveal the next correct letter in position
    const nextPos = answer.length
    if (nextPos >= current.word.length) return
    const needed = current.word[nextPos]
    const poolIdx = pool.findIndex((l) => l === needed)
    if (poolIdx === -1) return
    setHintsUsed((h) => h + 1)
    tapPoolLetter(poolIdx)
  }

  function handleRestart() {
    setIndex(0)
    setPool(shuffleWord(allWords[0].word))
    setAnswer([])
    setFeedback(null)
    setScore(0)
    setDone(false)
    setHintsUsed(0)
  }

  const pct = Math.round((score / (allWords.length * 10)) * 100)

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-lg text-center">
          <p className="text-7xl mb-4">{pct >= 80 ? '🌟' : pct >= 50 ? '🎉' : '💪'}</p>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {pct >= 80
              ? t(language, 'greatJob')
              : pct >= 50
              ? t(language, 'goodJob')
              : t(language, 'keepPractising')}
          </h1>
          <p className="text-xl text-gray-500 mb-6">
            {score} / {allWords.length * 10} points
          </p>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
            <div
              className={`h-4 rounded-full transition-all ${
                pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-400' : 'bg-orange-400'
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
              className="flex-1 bg-violet-600 hover:bg-violet-700 text-white text-xl font-semibold py-4 rounded-2xl transition-colors"
            >
              {t(language, 'continueBtn')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const bgFeedback =
    feedback === 'correct'
      ? 'bg-green-100'
      : feedback === 'wrong'
      ? 'bg-red-100'
      : 'bg-white'

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 max-w-2xl mx-auto w-full">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-lg"
        >
          <ArrowLeft size={22} /> {t(language, 'back')}
        </button>
        <span className="text-gray-500 text-lg font-medium">
          {index + 1} / {allWords.length}
        </span>
      </div>

      {/* Progress */}
      <div className="w-full max-w-2xl mx-auto bg-gray-200 rounded-full h-3 mb-8">
        <div
          className="bg-violet-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${((index) / allWords.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 max-w-2xl mx-auto w-full">
        {/* Hint */}
        <div className="bg-violet-100 rounded-2xl px-6 py-4 text-center w-full">
          <p className="text-violet-700 text-lg font-medium">{current.hint}</p>
        </div>

        {/* Answer slots */}
        <div
          className={`rounded-2xl p-6 w-full min-h-[80px] flex flex-wrap justify-center items-center gap-3 transition-colors ${bgFeedback} shadow-inner border-2 ${
            feedback === 'correct'
              ? 'border-green-400'
              : feedback === 'wrong'
              ? 'border-red-400'
              : 'border-gray-200'
          }`}
        >
          {answer.length === 0 && (
            <p className="text-gray-300 text-xl select-none">Tap letters below…</p>
          )}
          {answer.map((letter, i) => (
            <button
              key={i}
              onClick={() => tapAnswerLetter(i)}
              disabled={!!feedback}
              className="w-14 h-14 rounded-xl bg-violet-500 text-white text-2xl font-bold shadow-md active:scale-95 transition-transform select-none"
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Letter pool */}
        <div className="flex flex-wrap justify-center gap-3 w-full">
          {pool.map((letter, i) => (
            <button
              key={i}
              onClick={() => tapPoolLetter(i)}
              disabled={!!feedback}
              className="w-14 h-14 rounded-xl bg-white border-2 border-gray-300 text-gray-800 text-2xl font-bold shadow active:scale-95 transition-transform select-none"
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full">
          <button
            onClick={handleHint}
            disabled={!!feedback || pool.length === 0}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-100 text-amber-700 font-semibold text-lg disabled:opacity-40 active:scale-95 transition-transform"
          >
            <Lightbulb size={20} /> Hint {hintsUsed > 0 ? `(${hintsUsed})` : ''}
          </button>

          <button
            onClick={handleCheck}
            disabled={answer.length !== current.word.length || !!feedback}
            className="flex-1 py-3 rounded-2xl bg-violet-600 text-white font-bold text-xl disabled:opacity-40 active:scale-95 transition-transform"
          >
            {feedback === 'correct' ? '✅ Correct!' : feedback === 'wrong' ? '❌ Try again' : 'Check'}
          </button>

          <button
            onClick={handleSkip}
            disabled={!!feedback}
            className="px-5 py-3 rounded-2xl bg-gray-100 text-gray-600 font-semibold text-lg disabled:opacity-40 active:scale-95 transition-transform"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}
