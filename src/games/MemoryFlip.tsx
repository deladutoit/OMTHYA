import { useState, useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { RotateCcw, ArrowLeft } from 'lucide-react'
import { t } from '../lib/translations'
import { getPairs, pairCount, gridCols } from '../data/wordBanks'
import type { Subject, AgeGroup, Language } from '../types'

interface Props {
  subject: Subject
  ageGroup: AgeGroup
  language: Language
  onComplete: (score: number) => void
  onBack: () => void
}

interface Card {
  id: number
  pairId: number
  content: string
  flipped: boolean
  matched: boolean
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildCards(subject: Subject, ageGroup: AgeGroup, language: Language): Card[] {
  const allPairs = getPairs(subject, ageGroup, language)
  const count = pairCount(ageGroup)
  const selected = shuffle(allPairs).slice(0, count)

  const cards: Card[] = []
  selected.forEach((pair, pairId) => {
    cards.push({ id: pairId * 2,     pairId, content: pair.a, flipped: false, matched: false })
    cards.push({ id: pairId * 2 + 1, pairId, content: pair.b, flipped: false, matched: false })
  })

  return shuffle(cards)
}

export function MemoryFlip({ subject, ageGroup, language, onComplete, onBack }: Props) {
  const [cards, setCards] = useState<Card[]>(() =>
    buildCards(subject, ageGroup, language),
  )
  const [, setSelected] = useState<number[]>([])
  const [locked, setLocked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [done, setDone] = useState(false)

  const cols = gridCols(ageGroup)
  const totalPairs = cards.length / 2
  const matchedPairs = cards.filter((c) => c.matched && c.id % 2 === 0).length

  // Fire confetti when all matched
  useEffect(() => {
    if (matchedPairs === totalPairs && totalPairs > 0) {
      setDone(true)
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } })
    }
  }, [matchedPairs, totalPairs])

  const handleCardClick = useCallback(
    (cardId: number) => {
      if (locked || done) return

      setCards((prev) => {
        const card = prev.find((c) => c.id === cardId)
        if (!card || card.flipped || card.matched) return prev
        return prev.map((c) => (c.id === cardId ? { ...c, flipped: true } : c))
      })

      setSelected((prev) => {
        const next = [...prev, cardId]

        if (next.length === 2) {
          setLocked(true)
          setAttempts((a) => a + 1)

          setCards((prevCards) => {
            const [idA, idB] = next
            const cardA = prevCards.find((c) => c.id === idA)!
            const cardB = prevCards.find((c) => c.id === idB)!

            if (cardA.pairId === cardB.pairId) {
              // Match
              const updated = prevCards.map((c) =>
                c.id === idA || c.id === idB ? { ...c, matched: true } : c,
              )
              setLocked(false)
              return updated
            } else {
              // No match — flip back after delay
              setTimeout(() => {
                setCards((c2) =>
                  c2.map((c) => (c.id === idA || c.id === idB ? { ...c, flipped: false } : c)),
                )
                setLocked(false)
              }, 1000)
              return prevCards
            }
          })

          return []
        }

        return next
      })
    },
    [locked, done],
  )

  function handleRestart() {
    setCards(buildCards(subject, ageGroup, language))
    setSelected([])
    setLocked(false)
    setAttempts(0)
    setDone(false)
  }

  // Score: perfect game = 100, each extra attempt costs points, min 10
  const perfectAttempts = totalPairs
  const score = Math.max(10, Math.round(100 - (attempts - perfectAttempts) * 5))

  if (done) {
    const pct = score
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-lg text-center">
          <p className="text-7xl mb-4">{pct >= 80 ? '🌟' : pct >= 50 ? '🎉' : '💪'}</p>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {pct >= 80
              ? t(language, 'greatJob')
              : pct >= 50
              ? t(language, 'goodJob')
              : t(language, 'keepPractising')}
          </h1>
          <p className="text-xl text-gray-500 mb-2">
            {totalPairs} {t(language, 'pairsWord')} · {attempts} {t(language, 'attemptsWord')}
          </p>

          {/* Score bar */}
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
              <RotateCcw size={22} /> {t(language, 'playAgain')}
            </button>
            <button
              onClick={() => onComplete(score)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xl font-semibold py-4 rounded-2xl transition-colors"
            >
              {t(language, 'continueBtn')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 max-w-4xl mx-auto w-full">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-lg"
        >
          <ArrowLeft size={22} /> {t(language, 'back')}
        </button>
        <div className="flex gap-6 text-gray-600 text-lg">
          <span>
            ✅ {matchedPairs} / {totalPairs}
          </span>
          <span>🔄 {attempts}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-4xl mx-auto bg-gray-200 rounded-full h-3 mb-8">
        <div
          className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${(matchedPairs / totalPairs) * 100}%` }}
        />
      </div>

      {/* Card grid */}
      <div
        className="grid gap-4 max-w-4xl mx-auto w-full"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {cards.map((card) => (
          <FlipCard
            key={card.id}
            card={card}
            onClick={() => handleCardClick(card.id)}
            ageGroup={ageGroup}
          />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// FlipCard — CSS 3D flip with inline styles (Tailwind has no perspective utils)
// ---------------------------------------------------------------------------

interface FlipCardProps {
  card: Card
  onClick: () => void
  ageGroup: AgeGroup
}

function FlipCard({ card, onClick, ageGroup }: FlipCardProps) {
  const isVisible = card.flipped || card.matched
  const textSize =
    ageGroup === 'early-learners' ? 'text-4xl' : 'text-xl'

  return (
    <div
      onClick={onClick}
      className="cursor-pointer select-none"
      style={{ perspective: '800px', minHeight: ageGroup === 'early-learners' ? '120px' : '96px' }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 'inherit',
          transformStyle: 'preserve-3d',
          transform: isVisible ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.45s ease',
        }}
      >
        {/* Back face (hidden side) */}
        <div
          className={`absolute inset-0 rounded-2xl flex items-center justify-center shadow-md ${
            card.matched ? 'bg-emerald-100' : 'bg-indigo-500 hover:bg-indigo-600'
          }`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-3xl text-white/60">?</span>
        </div>

        {/* Front face (content side) */}
        <div
          className={`absolute inset-0 rounded-2xl flex items-center justify-center shadow-md p-3 ${
            card.matched ? 'bg-emerald-400' : 'bg-white'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <span
            className={`${textSize} font-semibold text-center leading-tight ${
              card.matched ? 'text-white' : 'text-gray-800'
            }`}
          >
            {card.content}
          </span>
        </div>
      </div>
    </div>
  )
}
