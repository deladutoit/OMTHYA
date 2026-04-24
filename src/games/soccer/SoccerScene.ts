import * as Phaser from 'phaser'
import { t } from '../../lib/translations'
import type { Language } from '../../types'

// ─── Game settings ───────────────────────────────────────────────────────────
const WINNING_SCORE    = 5
const BASE_SPD_FACTOR  = 0.007   // H × this = initial ball speed (px/frame)
const SPEED_BUMP       = 1.10    // speed multiplier on each paddle hit (no cap)
const AI_SPEED_RATIO   = 0.82    // AI max speed as fraction of ball speed (beatable)

// ── helpers ──────────────────────────────────────────────────────────────────
function fmtPx(n: number, scale: number) { return `${Math.round(n * Math.max(scale, 0.5))}px` }

// ── SoccerPongScene ───────────────────────────────────────────────────────────
export class SoccerScene extends Phaser.Scene {
  private lang: Language = 'english'

  // Canvas
  private W = 800
  private H = 600
  private fs = 1

  // Layout constants (computed in create)
  private PADDLE_W = 0
  private PADDLE_H = 0
  private PLAYER_Y = 0   // y-centre of player (bottom) paddle
  private AI_Y     = 0   // y-centre of AI (top) paddle
  private BALL_R   = 0

  // Game state
  private playerX    = 0
  private aiX        = 0
  private ballX      = 0
  private ballY      = 0
  private ballVX     = 0
  private ballVY     = 0
  private ballSpeed  = 0
  private playerScore = 0
  private aiScore     = 0
  private phase: 'playing' | 'paused' | 'done' = 'playing'

  // Graphics
  private gField!:   Phaser.GameObjects.Graphics
  private gPaddles!: Phaser.GameObjects.Graphics
  private gBall!:    Phaser.GameObjects.Graphics

  // Text
  private txtScore!:  Phaser.GameObjects.Text
  private txtResult!: Phaser.GameObjects.Text

  constructor() { super({ key: 'SoccerScene' }) }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  create() {
    this.lang = (this.registry.get('language') as Language) ?? 'english'

    this.W  = this.scale.width  || 800
    this.H  = this.scale.height || 600
    this.fs = Math.min(this.W / 800, this.H / 600)

    // Layout
    this.PADDLE_W = this.W * 0.11
    this.PADDLE_H = Math.max(8, this.H * 0.014)
    this.PLAYER_Y = this.H * 0.88
    this.AI_Y     = this.H * 0.12
    this.BALL_R   = Math.min(this.W, this.H) * 0.026

    // Starting positions
    this.playerX = this.W / 2
    this.aiX     = this.W / 2
    this.resetBall()

    // Graphics layers
    this.gField   = this.add.graphics()
    this.gPaddles = this.add.graphics()
    this.gBall    = this.add.graphics()

    const f = (n: number) => fmtPx(n, this.fs)

    // Back button
    this.add.text(this.W * 0.025, this.H * 0.025, `← ${t(this.lang, 'back')}`, {
      fontSize: f(18), color: '#fff', stroke: '#000', strokeThickness: 2,
    }).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        const cb = this.registry.get('onBack') as (() => void) | undefined
        cb?.()
      })

    // Score (centre, semi-transparent so it doesn't distract)
    this.txtScore = this.add.text(this.W / 2, this.H / 2, '0  –  0', {
      fontSize: f(38), fontStyle: 'bold', color: '#ffffff',
      stroke: '#000', strokeThickness: 4, align: 'center',
    }).setOrigin(0.5).setAlpha(0.45)

    // Goal / result announcement
    this.txtResult = this.add.text(this.W / 2, this.H / 2, '', {
      fontSize: f(64), fontStyle: 'bold', color: '#fff',
      stroke: '#000', strokeThickness: 8, align: 'center',
    }).setOrigin(0.5).setVisible(false)

    // Controls — finger/mouse moves bottom paddle
    this.input.on('pointerdown', (ptr: Phaser.Input.Pointer) => this.movePaddle(ptr.x))
    this.input.on('pointermove', (ptr: Phaser.Input.Pointer) => {
      if (ptr.isDown) this.movePaddle(ptr.x)
    })

    // Restart on orientation change
    this.scale.on('resize', () => { this.scene.restart() }, this)
  }

  update() {
    if (this.phase !== 'playing') return
    this.stepBall()
    this.stepAI()
    this.redrawAll()
  }

  // ── Input ─────────────────────────────────────────────────────────────────
  private movePaddle(x: number) {
    const half = this.PADDLE_W / 2
    this.playerX = Phaser.Math.Clamp(x, half, this.W - half)
  }

  // ── Ball ──────────────────────────────────────────────────────────────────
  private resetBall() {
    this.ballX     = this.W / 2
    this.ballY     = this.H / 2
    this.ballSpeed = this.H * BASE_SPD_FACTOR
    const angle    = (Math.random() * 50 - 25) * (Math.PI / 180)
    const dir      = Math.random() > 0.5 ? 1 : -1
    this.ballVX    = Math.sin(angle) * this.ballSpeed
    this.ballVY    = dir * Math.cos(angle) * this.ballSpeed
  }

  private stepBall() {
    this.ballX += this.ballVX
    this.ballY += this.ballVY

    // Side walls
    if (this.ballX - this.BALL_R < 0) {
      this.ballX  = this.BALL_R
      this.ballVX = Math.abs(this.ballVX)
    } else if (this.ballX + this.BALL_R > this.W) {
      this.ballX  = this.W - this.BALL_R
      this.ballVX = -Math.abs(this.ballVX)
    }

    // Player paddle (bottom — ball moving downward)
    if (this.ballVY > 0
      && this.ballY + this.BALL_R >= this.PLAYER_Y - this.PADDLE_H / 2
      && this.ballY - this.BALL_R <= this.PLAYER_Y + this.PADDLE_H / 2
      && this.ballX > this.playerX - this.PADDLE_W / 2 - this.BALL_R
      && this.ballX < this.playerX + this.PADDLE_W / 2 + this.BALL_R) {
      this.bounce(this.playerX, this.PLAYER_Y - this.PADDLE_H / 2 - this.BALL_R, -1)
    }

    // AI paddle (top — ball moving upward)
    if (this.ballVY < 0
      && this.ballY - this.BALL_R <= this.AI_Y + this.PADDLE_H / 2
      && this.ballY + this.BALL_R >= this.AI_Y - this.PADDLE_H / 2
      && this.ballX > this.aiX - this.PADDLE_W / 2 - this.BALL_R
      && this.ballX < this.aiX + this.PADDLE_W / 2 + this.BALL_R) {
      this.bounce(this.aiX, this.AI_Y + this.PADDLE_H / 2 + this.BALL_R, 1)
    }

    // Scoring — ball past a paddle
    if (this.ballY - this.BALL_R > this.H) {
      this.aiScore++
      this.onGoal(false)
    } else if (this.ballY + this.BALL_R < 0) {
      this.playerScore++
      this.onGoal(true)
    }
  }

  private bounce(paddleX: number, newBallY: number, dir: 1 | -1) {
    this.ballY    = newBallY
    this.ballSpeed = this.ballSpeed * SPEED_BUMP
    const offset   = Phaser.Math.Clamp((this.ballX - paddleX) / (this.PADDLE_W / 2), -1, 1)
    const maxAngle = 65 * (Math.PI / 180)
    const angle    = offset * maxAngle
    this.ballVX    = Math.sin(angle) * this.ballSpeed
    this.ballVY    = dir * Math.cos(angle) * this.ballSpeed
  }

  // ── AI ────────────────────────────────────────────────────────────────────
  private stepAI() {
    // Track ball when it moves toward AI; drift back to centre otherwise
    const targetX = this.ballVY < 0 ? this.ballX : this.W / 2
    const diff     = targetX - this.aiX
    const maxMove  = this.ballSpeed * AI_SPEED_RATIO
    if (Math.abs(diff) > 1) {
      this.aiX += Math.sign(diff) * Math.min(Math.abs(diff), maxMove)
    }
    this.aiX = Phaser.Math.Clamp(this.aiX, this.PADDLE_W / 2, this.W - this.PADDLE_W / 2)
  }

  // ── Goal scored ───────────────────────────────────────────────────────────
  private onGoal(playerScored: boolean) {
    this.phase = 'paused'
    this.txtScore.setText(`${this.playerScore}  –  ${this.aiScore}`)

    this.txtResult.setText(t(this.lang, 'goalMsg'))
    this.txtResult.setStyle({
      color:  playerScored ? '#bbf7d0' : '#fecaca',
      stroke: playerScored ? '#16a34a' : '#7f1d1d',
    })
    this.txtResult.setVisible(true)

    if (playerScored) {
      this.cameras.main.flash(300, 0, 160, 0, false)
    } else {
      this.cameras.main.shake(220, 0.005)
    }

    const done = this.playerScore >= WINNING_SCORE || this.aiScore >= WINNING_SCORE

    this.time.delayedCall(1400, () => {
      this.txtResult.setVisible(false)
      if (done) {
        this.showEnd()
      } else {
        this.resetBall()
        this.playerX = this.W / 2
        this.aiX     = this.W / 2
        this.phase   = 'playing'
      }
    })
  }

  // ── End screen ────────────────────────────────────────────────────────────
  private showEnd() {
    this.phase = 'done'
    const won = this.playerScore >= WINNING_SCORE
    const f   = (n: number) => fmtPx(n, this.fs)

    const ratingKey = won ? 'soccerRating5' : 'soccerRating0'
    this.txtResult.setText(`${t(this.lang, ratingKey)}\n${this.playerScore} – ${this.aiScore}`)
    this.txtResult.setStyle({
      fontSize:        f(44),
      color:           won ? '#bbf7d0' : '#fecaca',
      stroke:          won ? '#16a34a' : '#7f1d1d',
      strokeThickness: 6,
      align:           'center',
    })
    this.txtResult.setVisible(true)

    this.add.text(this.W / 2, this.H * 0.67, `▶  ${t(this.lang, 'playAgain')}`, {
      fontSize: f(22), fontStyle: 'bold', color: '#fff',
      backgroundColor: '#16a34a', padding: { x: 24, y: 14 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => { this.scene.restart() })
  }

  // ── Rendering ─────────────────────────────────────────────────────────────
  private redrawAll() {
    this.drawField()
    this.drawPaddles()
    this.drawBall()
  }

  private drawField() {
    const g = this.gField
    g.clear()
    const { W, H } = this

    // Base pitch
    g.fillStyle(0x16a34a)
    g.fillRect(0, 0, W, H)

    // Alternating stripe overlay
    const stripes = 10
    const sh = H / stripes
    for (let i = 0; i < stripes; i += 2) {
      g.fillStyle(0x15803d, 0.55)
      g.fillRect(0, i * sh, W, sh)
    }

    // Halfway line
    g.lineStyle(2, 0xffffff, 0.35)
    g.lineBetween(0, H / 2, W, H / 2)

    // Centre circle + spot
    const cr = Math.min(W * 0.1, H * 0.12)
    g.lineStyle(2, 0xffffff, 0.35)
    g.strokeCircle(W / 2, H / 2, cr)
    g.fillStyle(0xffffff, 0.5)
    g.fillCircle(W / 2, H / 2, 4)

    // Goal boxes
    const gw = W * 0.35
    const gx = (W - gw) / 2
    const boxH = this.AI_Y + this.PADDLE_H * 1.5

    // AI goal box (top, red tint)
    g.fillStyle(0xef4444, 0.12)
    g.fillRect(gx, 0, gw, boxH)
    g.lineStyle(2, 0xffffff, 0.4)
    g.strokeRect(gx, 0, gw, boxH)

    // Player goal box (bottom, green tint)
    const pyBoxT = this.PLAYER_Y - this.PADDLE_H * 1.5
    g.fillStyle(0x22c55e, 0.12)
    g.fillRect(gx, pyBoxT, gw, H - pyBoxT)
    g.lineStyle(2, 0xffffff, 0.4)
    g.strokeRect(gx, pyBoxT, gw, H - pyBoxT)
  }

  private drawPaddles() {
    const g = this.gPaddles
    g.clear()
    const { PADDLE_W, PADDLE_H } = this

    const paddle = (cx: number, cy: number, color: number) => {
      const x = cx - PADDLE_W / 2
      const y = cy - PADDLE_H / 2
      const r = PADDLE_H / 2
      // Drop shadow
      g.fillStyle(0x000000, 0.22)
      g.fillRoundedRect(x + 3, y + 4, PADDLE_W, PADDLE_H, r)
      // Body
      g.fillStyle(color)
      g.fillRoundedRect(x, y, PADDLE_W, PADDLE_H, r)
      // Highlight streak
      g.fillStyle(0xffffff, 0.3)
      g.fillRoundedRect(x + 5, y + 3, PADDLE_W - 10, PADDLE_H * 0.4, r * 0.7)
      // Border
      g.lineStyle(2, 0xffffff, 0.55)
      g.strokeRoundedRect(x, y, PADDLE_W, PADDLE_H, r)
    }

    paddle(this.aiX,     this.AI_Y,     0xef4444)  // AI   — red
    paddle(this.playerX, this.PLAYER_Y, 0x22c55e)  // You  — green
  }

  private drawBall() {
    const g = this.gBall
    g.clear()
    const r = this.BALL_R
    const bx = this.ballX, by = this.ballY

    // Shadow
    g.fillStyle(0x000000, 0.22)
    g.fillEllipse(bx + r * 0.2, by + r * 0.35, r * 2.1, r * 1.2)

    // Body
    g.fillStyle(0xffffff)
    g.fillCircle(bx, by, r)
    g.lineStyle(r * 0.07, 0x111111, 0.85)
    g.strokeCircle(bx, by, r)

    // Soccer patches
    g.fillStyle(0x111111)
    g.fillCircle(bx, by, r * 0.27)
    for (let i = 0; i < 5; i++) {
      const ang = (i * 72 - 90) * (Math.PI / 180)
      g.fillCircle(bx + Math.cos(ang) * r * 0.6, by + Math.sin(ang) * r * 0.6, r * 0.18)
    }

    // Shine
    g.fillStyle(0xffffff, 0.55)
    g.fillCircle(bx - r * 0.28, by - r * 0.28, r * 0.22)
  }
}
