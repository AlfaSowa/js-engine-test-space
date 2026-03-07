import { useEffect, useState } from 'react'
import { Game } from '../game'

const game = new Game()

export const App = () => {
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false)

  useEffect(() => {
    if (!game.isStarted) {
      game.init()
    }
  }, [])

  useEffect(() => {
    game.signals.onGameStarted.connect((isStarted) => {
      setIsGameStarted(isStarted)
    })
  }, [])

  return <div id="canvas-wrapper" className="absolute top-0 left-0" />
}
