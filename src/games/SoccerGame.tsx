import { useState, useRef, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { ArrowLeft, RotateCcw } from 'lucide-react'

interface Props {
  onBack: () => void
}

const SHOTS_TOTAL = 5

// SVG scene size
const W = 400, H = 470

// Goal bounds
const GL = 72, GT = 48, GW = 256, GH = 132
const GR = GL + GW, GB = GT + GH

// Net grid
const NET_COLS = 8, NET_ROWS = 4

// Goalkeeper
const KW = 38, KH = 78
const K_Y = GB - KH
const K_CENTER_X = W / 2 - KW / 2
const K_LEFT_X   = GL + 12
const K_RIGHT_X  = GR - KW - 12

// Ball start (penalty spot)
const BALL_X = W / 2, BALL_Y = 400

// Zone boundaries inside goal
const Z1 = GL + GW / 3
const Z2 = GL + 2 * GW / 3

type Zone = 'left' | 'center' | 'right'
type Phase = 'aim' | 'flying' | 'result'

function zoneOf(x: number): Zone {
  return x < Z1 ? 'left' : x < Z2 ? 'center' : 'right'
}

function keeperX(zone: Zone): number {
  return zone === 'left' ? K_LEFT_X : zone === 'right' ? K_RIGHT_X : K_CENTER_X
}

// ---------------------------------------------------------------------------
// Goalkeeper SVG figure
// ---------------------------------------------------------------------------
function Goalkeeper({ cx, diving }: { cx: number; diving: boolean }) {
  return (
    <g
      style={{
        transform: `translate(${cx}px, ${K_Y}px)`,
        transition: diving ? 'transform 0.38s cubic-bezier(0.22,1,0.36,1)' : 'none',
      }}
    >
      {/* Jersey */}
      <rect x={0} y={0} width={KW} height={KH} rx={6} fill="#f59e0b" />
      <text x={KW / 2} y={KH * 0.62} textAnchor="middle" fontSize="15" fontWeight="bold" fill="white">1</text>
      {/* Head */}
      <circle cx={KW / 2} cy={-16} r={16} fill="#fde68a" />
      {/* Eyes */}
      <circle cx={KW / 2 - 5} cy={-19} r={2.5} fill="#374151" />
      <circle cx={KW / 2 + 5} cy={-19} r={2.5} fill="#374151" />
      {/* Mouth */}
      <path d={`M ${KW / 2 - 5} -10 Q ${KW / 2} -6 ${KW / 2 + 5} -10`} stroke="#374151" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Gloves */}
      <circle cx={-8} cy={KH * 0.38} r={9} fill="#16a34a" />
      <circle cx={KW + 8} cy={KH * 0.38} r={9} fill="#16a34a" />
    </g>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function SoccerGame({ onBack }: Props) {
  const [phase, setPhase]       = useState<Phase>('aim')
  const [shots, setShots]       = useState(0)
  const [goals, setGoals]       = useState(0)
  const [ballPos, setBallPos]   = useState({ x: BALL_X, y: BALL_Y })
  const [kZone, setKZone]       = useState<Zone>('center')
  const [diving, setDiving]     = useState(false)
  const [isGoal, setIsGoal]     = useState(false)
  const [done, setDone]         = useState(false)

  // Refs so setTimeout callbacks always have current values
  const shotsRef = useRef(0)
  const goalsRef = useRef(0)
  const svgRef   = useRef<SVGSVGElement>(null)

  const handlePointer = useCallback((e: React.PointerEvent<SVGRectElement>) => {
    if (phase !== 'aim' || !svgRef.current) return

    const rect = svgRef.current.getBoundingClientRect()
    const scaleX = W / rect.width
    const scaleY = H / rect.height
    const tapX = Math.max(GL + 4, Math.min(GR - 4, (e.clientX - rect.left) * scaleX))
    const tapY = Math.max(GT + 4, Math.min(GB - 4, (e.clientY - rect.top) * scaleY))

    // Keeper picks a random zone to dive
    const zones: Zone[] = ['left', 'center', 'right']
    const zone = zones[Math.floor(Math.random() * 3)]
    setKZone(zone)
    setDiving(true)
    setBallPos({ x: tapX, y: tapY })
    setPhase('flying')

    // After ball animation resolves, evaluate result
    setTimeout(() => {
      const scored = zoneOf(tapX) !== zone
      setIsGoal(scored)
      setPhase('result')

      if (scored) {
        goalsRef.current++
        setGoals(goalsRef.current)
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.35 } })
      }
      shotsRef.current++
      setShots(shotsRef.current)

      // Reset for next shot
      setTimeout(() => {
        if (shotsRef.current >= SHOTS_TOTAL) {
          setDone(true)
        } else {
          setBallPos({ x: BALL_X, y: BALL_Y })
          setKZone('center')
          setDiving(false)
          setPhase('aim')
        }
      }, 2200)
    }, 680)
  }, [phase])

  function handleRestart() {
    setPhase('aim')
    setShots(0)
    setGoals(0)
    shotsRef.current = 0
    goalsRef.current = 0
    setBallPos({ x: BALL_X, y: BALL_Y })
    setKZone('center')
    setDiving(false)
    setIsGoal(false)
    setDone(false)
  }

  if (done) {
    const g = goalsRef.current
    const rating =
      g === 5 ? '🏆 Perfect! Unstoppable!'
      : g === 4 ? '⭐ World Class Striker!'
      : g === 3 ? '🔥 Great Shot!'
      : g === 2 ? '👍 Not Bad!'
      : g === 1 ? '💪 Keep Practising!'
      : '😅 The keeper wins this time!'

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-lg text-center">
          <p className="text-8xl mb-4">{g === 5 ? '🏆' : g >= 3 ? '⚽' : '🧤'}</p>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">{rating}</h1>
          <p className="text-7xl font-black text-green-600 mb-1">{g}<span className="text-3xl text-gray-400"> / {SHOTS_TOTAL}</span></p>
          <p className="text-xl text-gray-400 mb-8">goals scored</p>
          <div className="flex gap-4">
            <button
              onClick={handleRestart}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xl font-semibold py-4 rounded-2xl transition-colors"
            >
              <RotateCcw size={22} /> Play Again
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xl font-semibold py-4 rounded-2xl transition-colors"
            >
              Menu
            </button>
          </div>
        </div>
      </div>
    )
  }

  const kx = keeperX(kZone)

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-green-700 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <button onClick={onBack} className="flex items-center gap-2 text-white text-lg font-medium">
          <ArrowLeft size={22} /> Back
        </button>
        <div className="text-white text-3xl font-black">
          ⚽ {goals}
        </div>
        <div className="text-white/70 text-base font-medium">
          Shot {Math.min(shots + 1, SHOTS_TOTAL)} of {SHOTS_TOTAL}
        </div>
      </div>

      {/* Shot tracker */}
      <div className="flex justify-center gap-3 pb-2 text-2xl">
        {Array.from({ length: SHOTS_TOTAL }, (_, i) => {
          if (i < shots) return <span key={i}>{'—'}</span>
          if (i === shots && phase !== 'result') return <span key={i} className="animate-pulse">🎯</span>
          return <span key={i} className="opacity-30">●</span>
        })}
      </div>

      {/* Scene */}
      <div className="flex-1 flex flex-col items-center justify-start px-3 pt-1">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl"
          style={{ touchAction: 'none' }}
        >
          <defs>
            <linearGradient id="sg-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </linearGradient>
            <linearGradient id="sg-pitch" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
          </defs>

          {/* Sky */}
          <rect x="0" y="0" width={W} height={H * 0.55} fill="url(#sg-sky)" />

          {/* Simple clouds */}
          {[[60, 30, 40], [290, 22, 30], [170, 15, 25]].map(([cx, cy, r], i) => (
            <g key={i} opacity="0.85">
              <ellipse cx={cx} cy={cy} rx={r * 1.6} ry={r * 0.7} fill="white" />
              <ellipse cx={cx - r * 0.6} cy={cy + 2} rx={r} ry={r * 0.6} fill="white" />
              <ellipse cx={cx + r * 0.6} cy={cy + 2} rx={r} ry={r * 0.6} fill="white" />
            </g>
          ))}

          {/* Pitch */}
          <rect x="0" y={H * 0.55} width={W} height={H * 0.45} fill="url(#sg-pitch)" />

          {/* Alternating pitch stripes */}
          {Array.from({ length: 5 }, (_, i) => (
            <rect key={i} x={0} y={H * 0.55 + i * 42} width={W} height={21}
              fill="rgba(0,0,0,0.04)" />
          ))}

          {/* Penalty box markings */}
          <rect x={GL - 20} y={GB} width={GW + 40} height={70}
            fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <line x1={W / 2} y1={GB} x2={W / 2} y2={GB + 70}
            stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

          {/* Goal back net fill */}
          <rect x={GL} y={GT} width={GW} height={GH} fill="rgba(0,0,0,0.18)" />

          {/* Net grid — horizontal */}
          {Array.from({ length: NET_ROWS + 1 }, (_, i) => (
            <line key={`h${i}`}
              x1={GL} y1={GT + (GH / NET_ROWS) * i}
              x2={GR} y2={GT + (GH / NET_ROWS) * i}
              stroke="rgba(255,255,255,0.28)" strokeWidth="0.8" />
          ))}
          {/* Net grid — vertical */}
          {Array.from({ length: NET_COLS + 1 }, (_, i) => (
            <line key={`v${i}`}
              x1={GL + (GW / NET_COLS) * i} y1={GT}
              x2={GL + (GW / NET_COLS) * i} y2={GB}
              stroke="rgba(255,255,255,0.28)" strokeWidth="0.8" />
          ))}

          {/* Goal shadow on pitch */}
          <rect x={GL + 4} y={GB} width={GW - 8} height={8}
            fill="rgba(0,0,0,0.25)" rx={2} />

          {/* Left post */}
          <rect x={GL - 6} y={GT - 4} width={6} height={GH + 10} rx={2} fill="white" />
          {/* Right post */}
          <rect x={GR} y={GT - 4} width={6} height={GH + 10} rx={2} fill="white" />
          {/* Crossbar */}
          <rect x={GL - 6} y={GT - 6} width={GW + 12} height={6} rx={2} fill="white" />

          {/* Goalkeeper */}
          <Goalkeeper cx={kx} diving={diving} />

          {/* Penalty spot */}
          <circle cx={W / 2} cy={BALL_Y + 16} r={5} fill="rgba(255,255,255,0.45)" />
          <circle cx={W / 2} cy={BALL_Y + 16} r={2} fill="rgba(255,255,255,0.8)" />

          {/* Ball */}
          <g
            style={{
              transform: `translate(${ballPos.x}px, ${ballPos.y}px)`,
              transition: phase === 'flying' ? 'transform 0.62s cubic-bezier(0.4,0,0.6,1)' : 'none',
            }}
          >
            {/* Ball shadow (disappears when ball is in goal area) */}
            {phase !== 'flying' && (
              <ellipse cx={0} cy={18} rx={14} ry={5} fill="rgba(0,0,0,0.2)" />
            )}
            {/* Ball body */}
            <circle cx={0} cy={0} r={15} fill="white" stroke="#222" strokeWidth="1.2" />
            {/* Pentagon patches */}
            <polygon points="0,-8 7.6,-2.5 4.7,6.5 -4.7,6.5 -7.6,-2.5" fill="#222" />
            <polygon points="0,-15 5,-10 0,-8 -5,-10" fill="#222" />
            <polygon points="15,0 10,-4 7.6,-2.5 9,4" fill="#222" />
            <polygon points="-15,0 -10,-4 -7.6,-2.5 -9,4" fill="#222" />
            <polygon points="4.7,6.5 9,4 12,9 7,13" fill="#222" />
            <polygon points="-4.7,6.5 -9,4 -12,9 -7,13" fill="#222" />
          </g>

          {/* Zone hint dashes when aiming */}
          {phase === 'aim' && (
            <>
              <line x1={Z1} y1={GT - 2} x2={Z1} y2={GB}
                stroke="rgba(255,255,0,0.3)" strokeWidth="1" strokeDasharray="5 4" />
              <line x1={Z2} y1={GT - 2} x2={Z2} y2={GB}
                stroke="rgba(255,255,0,0.3)" strokeWidth="1" strokeDasharray="5 4" />
            </>
          )}

          {/* Tap target over the goal (captures pointer) */}
          {phase === 'aim' && (
            <rect
              x={GL} y={GT} width={GW} height={GH}
              fill="transparent"
              style={{ cursor: 'crosshair', touchAction: 'none' }}
              onPointerDown={handlePointer}
            />
          )}

          {/* Aim prompt */}
          {phase === 'aim' && (
            <text x={W / 2} y={GT - 14}
              textAnchor="middle" fontSize="13" fontWeight="bold"
              fill="rgba(255,255,0,0.9)"
            >
              TAP THE GOAL TO SHOOT ▲
            </text>
          )}

          {/* Result overlay */}
          {phase === 'result' && (
            <>
              <rect x="0" y="0" width={W} height={H}
                fill={isGoal ? 'rgba(0,180,0,0.22)' : 'rgba(180,0,0,0.18)'} />
              <text
                x={W / 2} y={H * 0.42}
                textAnchor="middle"
                fontSize="56"
                fontWeight="900"
                fill={isGoal ? '#ffffff' : '#ffffff'}
                stroke={isGoal ? '#16a34a' : '#dc2626'}
                strokeWidth="4"
                paintOrder="stroke"
              >
                {isGoal ? 'GOAL! 🎉' : 'SAVED! 🧤'}
              </text>
            </>
          )}
        </svg>

        {/* Below-SVG status */}
        <div className="mt-4 text-center text-white min-h-[48px]">
          {phase === 'aim' && (
            <p className="text-xl font-semibold text-white/80">
              Choose your spot — keeper doesn't know where!
            </p>
          )}
          {phase === 'flying' && (
            <p className="text-2xl font-black animate-pulse">🌟</p>
          )}
          {phase === 'result' && (
            <p className={`text-3xl font-black ${isGoal ? 'text-yellow-300' : 'text-red-300'}`}>
              {isGoal ? '🔥 Nice one!' : '😤 The keeper wins!'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
