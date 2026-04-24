import { useEffect, useRef } from 'react'
import * as Phaser from 'phaser'
import { SoccerScene } from './soccer/SoccerScene'
import type { Language } from '../types'

interface Props {
  language: Language
  onBack: () => void
}

export function SoccerGame({ language, onBack }: Props) {
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
        // RESIZE makes the canvas fill the parent div at native resolution,
        // so the scene always has access to the real viewport dimensions.
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      disableContextMenu: true,
    }

    const game = new Phaser.Game(config)
    game.registry.set('onBack', onBack)
    game.registry.set('language', language)
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
        touchAction: 'none',
      }}
    />
  )
}
