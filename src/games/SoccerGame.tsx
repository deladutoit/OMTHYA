import { useEffect, useRef } from 'react'
import * as Phaser from 'phaser'
import { SoccerScene } from './soccer/SoccerScene'

interface Props {
  onBack: () => void
}

export function SoccerGame({ onBack }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef      = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      backgroundColor: '#0ea5e9',
      scene: [SoccerScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 400,
        height: 600,
      },
      // Disable right-click context menu on canvas
      disableContextMenu: true,
    }

    const game = new Phaser.Game(config)
    // Registry is read in scene.create() which fires on next animation frame,
    // so this assignment is always safe.
    game.registry.set('onBack', onBack)
    gameRef.current = game

    return () => {
      game.destroy(true)
      gameRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        touchAction: 'none',   // prevent browser scroll during swipe
      }}
    />
  )
}
