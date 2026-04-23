import * as Phaser from 'phaser'

// ─── Scene dimensions ───────────────────────────────────────────────────────
const W = 400
const H = 600

// ─── Goal (screen-space) ────────────────────────────────────────────────────
const GOAL_L = 105
const GOAL_R = 295
const GOAL_T = 105
const GOAL_B = 180
const GOAL_W = GOAL_R - GOAL_L
const GOAL_H = GOAL_B - GOAL_T

// ─── Ball ───────────────────────────────────────────────────────────────────
const BALL_X0 = W / 2
const BALL_Y0 = 490
const R_NEAR  = 30   // radius at penalty spot
const R_FAR   = 7    // radius when inside goal

// ─── Perspective ────────────────────────────────────────────────────────────
const NEAR_Y  = BALL_Y0
const FAR_Y   = GOAL_B

// ─── Keeper ─────────────────────────────────────────────────────────────────
const KP_W    = 46
const KP_H    = 50
const KP_CY   = GOAL_T + GOAL_H * 0.28   // top-y of keeper body
const KP_CX0  = W / 2                    // centre-x start

// ─── Game settings ──────────────────────────────────────────────────────────
const SHOTS_TOTAL = 5
const GRAVITY     = 0.14
const SPIN_DRIFT  = 0.022

type Phase = 'ready' | 'swiping' | 'flying' | 'result' | 'done'

// ── helpers ─────────────────────────────────────────────────────────────────
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }

function perspScale(y: number) {
  return clamp(0.18 + 0.82 * ((y - FAR_Y) / (NEAR_Y - FAR_Y)), 0.12, 1)
}

// ── SoccerScene ──────────────────────────────────────────────────────────────
export class SoccerScene extends Phaser.Scene {
  // State
  private phase: Phase = 'ready'
  private shots  = 0
  private goals  = 0
  private evaluated = false   // prevent multi-eval per shot

  // Swipe
  private swipeStart: { x: number; y: number; time: number } | null = null
  private swipePoints: { x: number; y: number; time: number }[] = []

  // Ball physics
  private bx    = BALL_X0
  private by    = BALL_Y0
  private bvx   = 0
  private bvy   = 0
  private bspin = 0
  private bScale = 1

  // Keeper
  private kCX   = KP_CX0    // current centre-x
  private kTCX  = KP_CX0    // target centre-x
  private kLean = 0          // lean angle for dive animation (-1 left, 1 right)

  // Graphics layers
  private gField!:  Phaser.GameObjects.Graphics
  private gGoal!:   Phaser.GameObjects.Graphics
  private gKeeper!: Phaser.GameObjects.Graphics
  private gBall!:   Phaser.GameObjects.Graphics
  private gFX!:     Phaser.GameObjects.Graphics   // swipe arrow, power bar

  // Text
  private txtGoals!:   Phaser.GameObjects.Text
  private txtShot!:    Phaser.GameObjects.Text
  private txtHint!:    Phaser.GameObjects.Text
  private txtResult!:  Phaser.GameObjects.Text


  constructor() { super({ key: 'SoccerScene' }) }

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  create() {
    // Graphics layers (z-order matters)
    this.gField  = this.add.graphics()
    this.gGoal   = this.add.graphics()
    this.gKeeper = this.add.graphics()
    this.gBall   = this.add.graphics()
    this.gFX     = this.add.graphics()

    // Back button
    this.add.text(14, 20, '← Back', {
      fontSize: '18px', color: '#fff',
      stroke: '#000', strokeThickness: 2,
    }).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        const cb = this.registry.get('onBack') as (() => void) | undefined
        cb?.()
      })

    // Goals counter
    this.txtGoals = this.add.text(W / 2, 22, '⚽  0', {
      fontSize: '26px', fontStyle: 'bold', color: '#fff',
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5, 0.5)

    // Shot counter
    this.txtShot = this.add.text(W - 14, 22, '1 / 5', {
      fontSize: '17px', color: '#fff',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(1, 0.5)

    // Hint text
    this.txtHint = this.add.text(W / 2, H - 58, 'Swipe up from the ball to shoot', {
      fontSize: '17px', fontStyle: 'bold', color: '#ffff00',
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5)

    // Result overlay
    this.txtResult = this.add.text(W / 2, H * 0.44, '', {
      fontSize: '54px', fontStyle: 'bold', color: '#fff',
      stroke: '#000', strokeThickness: 6,
    }).setOrigin(0.5).setVisible(false)

    // Input
    this.input.on('pointerdown', this.onDown,  this)
    this.input.on('pointermove', this.onMove,  this)
    this.input.on('pointerup',   this.onUp,    this)
  }

  update() {
    if (this.phase === 'flying') this.stepPhysics()
    this.stepKeeper()
    this.redrawAll()
  }

  // ── Physics ────────────────────────────────────────────────────────────────
  private stepPhysics() {
    this.bvy  += GRAVITY
    this.bvx  += this.bspin * SPIN_DRIFT
    this.bx   += this.bvx
    this.by   += this.bvy
    this.bScale = perspScale(this.by)

    if (this.evaluated) return

    // Ball has reached the goal area
    if (this.by <= GOAL_B + 4) {
      this.evaluated = true

      const inPost = this.bx >= GOAL_L && this.bx <= GOAL_R
      const inBar  = this.by >= GOAL_T && this.by <= GOAL_B
      const hitPost = Math.abs(this.bx - GOAL_L) < 6 || Math.abs(this.bx - GOAL_R) < 6
      const hitBar  = Math.abs(this.by - GOAL_T) < 6

      if (hitPost || hitBar) {
        // Post / bar clang — bounce then miss
        this.cameras.main.shake(180, 0.006)
        this.bvx *= -0.5
        this.bvy  = Math.abs(this.bvy) * 0.4
        this.evaluated = false   // re-evaluate after bounce
        return
      }

      if (inPost && inBar) {
        // Inside goal — check keeper reach
        const kReach = KP_W * 0.72
        if (Math.abs(this.bx - this.kCX) < kReach) {
          this.onResult(false, 'SAVED! 🧤')
        } else {
          this.goals++
          this.onResult(true, 'GOAL! 🎉')
        }
      } else if (!inPost) {
        this.onResult(false, this.bx < GOAL_L ? 'WIDE LEFT!' : 'WIDE RIGHT!')
      } else {
        this.onResult(false, 'OVER THE BAR!')
      }
    }

    // Ball left screen without hitting goal area
    if (this.by < GOAL_T - 80 || this.bx < -60 || this.bx > W + 60) {
      if (!this.evaluated) { this.evaluated = true; this.onResult(false, 'MISS!') }
    }
  }

  // ── Keeper AI ──────────────────────────────────────────────────────────────
  private launchKeeper(bvx: number, bvy: number, spin: number) {
    // Estimate ball X when it crosses GOAL_B
    const frames = Math.abs((this.by - GOAL_B) / bvy)
    let predX = this.bx
    let predVX = bvx
    let predSpin = spin
    for (let f = 0; f < frames; f++) {
      predVX   += predSpin * SPIN_DRIFT
      predX    += predVX
    }
    // Add imperfect reaction (harder shots = more error)
    const speed = Math.sqrt(bvx * bvx + bvy * bvy)
    const error = (Math.random() - 0.5) * clamp(speed * 5, 20, 70)
    this.kTCX = clamp(predX + error, GOAL_L + KP_W / 2, GOAL_R - KP_W / 2)
    this.kLean = this.kTCX > this.kCX ? 1 : -1
  }

  private stepKeeper() {
    const speed = this.phase === 'flying' ? 0.16 : 0.08
    this.kCX = lerp(this.kCX, this.kTCX, speed)
  }

  // ── Input ──────────────────────────────────────────────────────────────────
  private onDown(ptr: Phaser.Input.Pointer) {
    if (this.phase !== 'ready') return
    // Require swipe to start in lower portion of screen (near ball)
    if (ptr.y < H * 0.55) return
    this.phase = 'swiping'
    this.swipeStart = { x: ptr.x, y: ptr.y, time: ptr.time }
    this.swipePoints = [{ x: ptr.x, y: ptr.y, time: ptr.time }]
  }

  private onMove(ptr: Phaser.Input.Pointer) {
    if (this.phase !== 'swiping') return
    this.swipePoints.push({ x: ptr.x, y: ptr.y, time: ptr.time })
    // Keep only recent points for velocity calc
    if (this.swipePoints.length > 12) this.swipePoints.shift()
  }

  private onUp(ptr: Phaser.Input.Pointer) {
    if (this.phase !== 'swiping' || !this.swipeStart) return

    const dx  = ptr.x - this.swipeStart.x
    const dy  = this.swipeStart.y - ptr.y   // positive = upward
    const dt  = Math.max(ptr.time - this.swipeStart.time, 30)

    this.swipeStart = null

    if (dy < 30) { this.phase = 'ready'; return }

    // Velocity from recent swipe segment
    const recent = this.swipePoints.slice(-4)
    const rdx = recent.length > 1 ? recent[recent.length - 1].x - recent[0].x : dx
    const rdy = recent.length > 1 ? recent[0].y - recent[recent.length - 1].y : dy
    const rdt = recent.length > 1 ? recent[recent.length - 1].time - recent[0].time : dt

    const speed = Math.sqrt(rdx * rdx + rdy * rdy) / Math.max(rdt, 15)

    // Power: maps swipe speed to ball velocity magnitude
    const power = clamp(speed * 10, 4, 22)

    // Direction: mostly upward, with horizontal aim from swipe angle
    const norm = Math.sqrt(rdx * rdx + rdy * rdy) || 1
    const bvx  = (rdx / norm) * power * 0.55
    const bvy  = -(rdy / norm) * power

    // Spin: detect curve from path (compare first half vs second half of swipe)
    const mid = Math.floor(this.swipePoints.length / 2)
    let spin = 0
    if (this.swipePoints.length >= 4) {
      const firstHalf  = this.swipePoints.slice(0, mid)
      const secondHalf = this.swipePoints.slice(mid)
      const fAngle = Math.atan2(firstHalf[0].y - firstHalf[firstHalf.length - 1].y,
                                firstHalf[firstHalf.length - 1].x - firstHalf[0].x)
      const sAngle = Math.atan2(secondHalf[0].y - secondHalf[secondHalf.length - 1].y,
                                secondHalf[secondHalf.length - 1].x - secondHalf[0].x)
      spin = clamp((sAngle - fAngle) * 1.8, -1.4, 1.4)
    }

    this.shoot(bvx, bvy, spin)
  }

  private shoot(bvx: number, bvy: number, spin: number) {
    this.bvx    = bvx
    this.bvy    = bvy
    this.bspin  = spin
    this.phase  = 'flying'
    this.evaluated = false
    this.txtHint.setVisible(false)
    this.launchKeeper(bvx, bvy, spin)
  }

  // ── Result ─────────────────────────────────────────────────────────────────
  private onResult(isGoal: boolean, msg: string) {
    if (this.phase === 'result' || this.phase === 'done') return
    this.phase = 'result'
    this.shots++

    this.txtGoals.setText(`⚽  ${this.goals}`)
    this.txtShot.setText(`${Math.min(this.shots + 1, SHOTS_TOTAL)} / ${SHOTS_TOTAL}`)

    this.txtResult.setText(msg)
    this.txtResult.setStyle({
      stroke: isGoal ? '#16a34a' : '#7f1d1d',
      color: isGoal ? '#bbf7d0' : '#fecaca',
    })
    this.txtResult.setVisible(true)

    if (isGoal) {
      this.cameras.main.flash(350, 0, 160, 0, false)
    } else {
      this.cameras.main.shake(240, 0.006)
    }

    this.time.delayedCall(2400, () => {
      this.txtResult.setVisible(false)
      if (this.shots >= SHOTS_TOTAL) {
        this.showEnd()
      } else {
        this.resetShot()
      }
    })
  }

  private resetShot() {
    this.bx = BALL_X0; this.by = BALL_Y0
    this.bvx = 0; this.bvy = 0; this.bspin = 0; this.bScale = 1
    this.kCX = KP_CX0; this.kTCX = KP_CX0; this.kLean = 0
    this.evaluated = false
    this.phase = 'ready'
    this.txtHint.setVisible(true)
    this.txtShot.setText(`${this.shots + 1} / ${SHOTS_TOTAL}`)
  }

  private showEnd() {
    this.phase = 'done'
    const g = this.goals
    const line1 = g === 5 ? '🏆 PERFECT!' : g >= 4 ? '⭐ WORLD CLASS' : g >= 3 ? '🔥 GREAT STRIKER' : g >= 2 ? '👍 DECENT SHOT' : '💪 KEEP TRYING'
    const line2 = `${g} / ${SHOTS_TOTAL} goals`

    this.txtResult.setText(`${line1}\n${line2}`)
    this.txtResult.setStyle({
      fontSize: '40px', color: '#fff', stroke: '#000', strokeThickness: 5, align: 'center',
    })
    this.txtResult.setVisible(true)

    // Play Again
    this.add.text(W / 2, H * 0.64, '▶  Play Again', {
      fontSize: '22px', fontStyle: 'bold', color: '#fff',
      backgroundColor: '#16a34a', padding: { x: 22, y: 14 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.restart()
      })
  }

  // ── Rendering ──────────────────────────────────────────────────────────────
  private redrawAll() {
    this.drawField()
    this.drawGoal()
    this.drawKeeper()
    this.drawBall()
    this.drawFX()
  }

  private drawField() {
    const g = this.gField
    g.clear()

    // Sky (simulated gradient with bands)
    const skyBands = [0x0ea5e9, 0x38bdf8, 0x7dd3fc, 0xbae6fd]
    const bandH = (H * 0.48) / skyBands.length
    skyBands.forEach((c, i) => {
      g.fillStyle(c); g.fillRect(0, i * bandH, W, bandH + 1)
    })

    // Clouds
    const clouds = [[70, 50, 28], [220, 38, 22], [330, 60, 18], [150, 28, 14]] as const
    g.fillStyle(0xffffff, 0.88)
    clouds.forEach(([cx, cy, r]) => {
      g.fillEllipse(cx, cy, r * 3, r * 1.2)
      g.fillEllipse(cx - r * 0.7, cy + 3, r * 1.8, r)
      g.fillEllipse(cx + r * 0.7, cy + 3, r * 1.8, r)
    })

    // Pitch gradient bands
    const pitchTop = H * 0.48
    const pitchColors = [0x16a34a, 0x15803d, 0x166534, 0x14532d]
    const pBandH = (H - pitchTop) / pitchColors.length
    pitchColors.forEach((c, i) => {
      g.fillStyle(c); g.fillRect(0, pitchTop + i * pBandH, W, pBandH + 1)
    })

    // Pitch stripe overlay
    for (let i = 0; i < 5; i++) {
      g.fillStyle(0x000000, 0.04)
      g.fillRect(0, pitchTop + i * 30, W, 15)
    }

    // Vanishing-point perspective lines
    const vx = W / 2, vy = H * 0.44
    g.lineStyle(1.5, 0xffffff, 0.22)
    g.lineBetween(0, H, vx, vy)
    g.lineBetween(W, H, vx, vy)

    // Penalty box
    const pbL = W * 0.14, pbR = W * 0.86, pbT = GOAL_B, pbBot = H * 0.86
    g.lineStyle(1.8, 0xffffff, 0.3)
    g.strokeRect(pbL, pbT, pbR - pbL, pbBot - pbT)

    // 6-yard box
    const sbL = W * 0.3, sbR = W * 0.7, sbT = GOAL_B, sbBot = GOAL_B + 44
    g.lineStyle(1.2, 0xffffff, 0.2)
    g.strokeRect(sbL, sbT, sbR - sbL, sbBot - sbT)

    // Penalty arc
    g.lineStyle(1.5, 0xffffff, 0.25)
    g.beginPath()
    g.arc(W / 2, BALL_Y0 + 16, 72, Phaser.Math.DegToRad(200), Phaser.Math.DegToRad(340))
    g.strokePath()

    // Penalty spot
    g.fillStyle(0xffffff, 0.55)
    g.fillCircle(W / 2, BALL_Y0 + 16, 4)

    // Goal line
    g.lineStyle(2, 0xffffff, 0.5)
    g.lineBetween(0, GOAL_B, W, GOAL_B)
  }

  private drawGoal() {
    const g = this.gGoal
    g.clear()

    // Net shadow
    g.fillStyle(0x000000, 0.12)
    g.fillRect(GOAL_L - 2, GOAL_T, GOAL_W + 4, GOAL_H + 8)

    // Net fill
    g.fillStyle(0x000000, 0.22)
    g.fillRect(GOAL_L, GOAL_T, GOAL_W, GOAL_H)

    // Net grid
    const cols = 12, rows = 6
    g.lineStyle(0.7, 0xffffff, 0.35)
    for (let c = 0; c <= cols; c++) {
      g.lineBetween(GOAL_L + (GOAL_W / cols) * c, GOAL_T,
                    GOAL_L + (GOAL_W / cols) * c, GOAL_B)
    }
    for (let r = 0; r <= rows; r++) {
      g.lineBetween(GOAL_L, GOAL_T + (GOAL_H / rows) * r,
                    GOAL_R, GOAL_T + (GOAL_H / rows) * r)
    }

    // Posts (with 3D depth shading)
    const postW = 8
    // Left post front face
    g.fillStyle(0xffffff); g.fillRect(GOAL_L - postW, GOAL_T - postW, postW, GOAL_H + postW)
    g.fillStyle(0xd1d5db); g.fillRect(GOAL_L - postW, GOAL_T - postW, 2, GOAL_H + postW)
    // Right post front face
    g.fillStyle(0xffffff); g.fillRect(GOAL_R, GOAL_T - postW, postW, GOAL_H + postW)
    g.fillStyle(0xd1d5db); g.fillRect(GOAL_R + postW - 2, GOAL_T - postW, 2, GOAL_H + postW)
    // Crossbar
    g.fillStyle(0xffffff); g.fillRect(GOAL_L - postW, GOAL_T - postW, GOAL_W + postW * 2, postW)
    g.fillStyle(0xd1d5db); g.fillRect(GOAL_L - postW, GOAL_T - postW, GOAL_W + postW * 2, 2)
  }

  private drawKeeper() {
    const g = this.gKeeper
    g.clear()

    const kx = this.kCX - KP_W / 2
    const ky = KP_CY

    // Lean matrix: when diving, keeper tilts
    const lean = this.kLean * (this.phase === 'flying' ? 0.35 : 0.08)

    // Draw in local coords with a lean transform approximation:
    // We'll just skew the rectangle horizontally using draw calls
    const skew = lean * KP_H * 0.4  // horizontal offset at top vs bottom

    // Body (jersey - yellow/amber)
    g.fillStyle(0xf59e0b)
    g.fillTriangle(
      kx + skew, ky,           kx + KP_W + skew, ky,
      kx + KP_W, ky + KP_H)
    g.fillTriangle(
      kx + skew, ky,           kx, ky + KP_H,
      kx + KP_W, ky + KP_H)

    // Jersey stripes
    g.lineStyle(1.5, 0xfbbf24, 0.6)
    g.lineBetween(kx + KP_W * 0.3 + skew * 0.5, ky + 4, kx + KP_W * 0.3, ky + KP_H - 4)
    g.lineBetween(kx + KP_W * 0.7 + skew * 0.5, ky + 4, kx + KP_W * 0.7, ky + KP_H - 4)

    // Head
    g.fillStyle(0xfde68a)
    g.fillCircle(this.kCX + skew * 0.5, ky - 14, 13)

    // Eyes
    g.fillStyle(0x374151)
    g.fillCircle(this.kCX - 4 + skew * 0.5, ky - 17, 2.5)
    g.fillCircle(this.kCX + 4 + skew * 0.5, ky - 17, 2.5)

    // Gloves
    g.fillStyle(0x16a34a)
    g.fillCircle(kx - 9 + skew * 0.3, ky + KP_H * 0.38, 9)
    g.fillCircle(kx + KP_W + 9 + skew * 0.3, ky + KP_H * 0.38, 9)

    // Legs
    g.fillStyle(0x1e3a5f)
    g.fillRect(kx + 4, ky + KP_H, KP_W * 0.38, 14)
    g.fillRect(kx + KP_W - 4 - KP_W * 0.38, ky + KP_H, KP_W * 0.38, 14)

    // Boots
    g.fillStyle(0x111827)
    g.fillRect(kx + 2, ky + KP_H + 14, KP_W * 0.42, 7)
    g.fillRect(kx + KP_W - 2 - KP_W * 0.42, ky + KP_H + 14, KP_W * 0.42, 7)
  }

  private drawBall() {
    const g = this.gBall
    g.clear()

    const r = clamp(R_NEAR * this.bScale, R_FAR, R_NEAR)
    const bx = this.bx, by = this.by

    // Shadow (only near ground level)
    if (this.bScale > 0.35) {
      const shadowAlpha = clamp((this.bScale - 0.35) * 0.55, 0, 0.35)
      g.fillStyle(0x000000, shadowAlpha)
      g.fillEllipse(bx, by + r * 1.05, r * 2.4, r * 0.55)
    }

    // Main ball body
    g.fillStyle(0xffffff)
    g.fillCircle(bx, by, r)

    // Outline
    g.lineStyle(r * 0.09, 0x111111, 0.9)
    g.strokeCircle(bx, by, r)

    // Central pentagon
    g.fillStyle(0x111111)
    g.fillCircle(bx, by, r * 0.27)

    // 5 surrounding patches
    for (let i = 0; i < 5; i++) {
      const ang = (i * 72 - 90) * (Math.PI / 180)
      g.fillCircle(bx + Math.cos(ang) * r * 0.6, by + Math.sin(ang) * r * 0.6, r * 0.18)
    }

    // Shine
    g.fillStyle(0xffffff, 0.5)
    g.fillCircle(bx - r * 0.3, by - r * 0.3, r * 0.22)
  }

  private drawFX() {
    const g = this.gFX
    g.clear()

    if (this.phase === 'ready') {
      // Pulsing ring around ball
      const t = this.time.now * 0.003
      const pulse = 0.4 + 0.35 * Math.sin(t)
      g.lineStyle(2.5, 0xfbbf24, pulse)
      g.strokeCircle(this.bx, this.by, R_NEAR + 12)

      // Up arrow
      const ax = W / 2, ay = this.by - R_NEAR - 18
      const arrowPulse = 0.6 + 0.4 * Math.sin(t + 1)
      g.lineStyle(3, 0xffff00, arrowPulse)
      g.lineBetween(ax, ay, ax, ay - 38)
      g.fillStyle(0xffff00, arrowPulse)
      g.fillTriangle(ax, ay - 52, ax - 9, ay - 38, ax + 9, ay - 38)
    }

    if (this.phase === 'swiping' && this.swipePoints.length > 1) {
      // Draw swipe trail
      const pts = this.swipePoints
      g.lineStyle(3, 0xfbbf24, 0.7)
      g.beginPath()
      g.moveTo(pts[0].x, pts[0].y)
      for (let i = 1; i < pts.length; i++) g.lineTo(pts[i].x, pts[i].y)
      g.strokePath()
    }
  }
}
