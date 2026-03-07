import { Signal } from 'typed-signals'
import { Engine, IGame } from '../engine/core'
import { MainMenuScene, MainScene } from './scenes'

export class Game implements IGame {
  engine: Engine = new Engine()
  isStarted: boolean = false

  public signals = {
    onGameStarted: new Signal<(isStarted: boolean) => void>()
  }

  async init() {
    const canvasWrapper = document.getElementById('canvas-wrapper')

    if (canvasWrapper) {
      this.isStarted = true
      this.signals.onGameStarted.emit(true)

      //----- SYSTEMS -----

      //----- ENGINE INIT -----
      await this.engine.init(canvasWrapper)

      //----- SCENES -----
      this.engine.sceneManager.add(MainMenuScene, false)
      this.engine.sceneManager.add(MainScene)

      this.engine.sceneManager.loadScene(MainMenuScene)

      this.engine.start(this.update)
    }
  }

  update(dt: number) {}
}
