import { Application } from 'pixi.js'
import { Engine, Scene } from '../core'

type SceneConstructor<C extends Scene> = new (id: string) => C

export class SceneManager {
  engine!: Engine
  scenes = new Map<string, Scene>()
  app!: Application

  currentScene: Scene | undefined

  init(app: Application, engine: Engine) {
    this.app = app
    this.engine = engine
  }

  add(scene: SceneConstructor<Scene>, isViewport: boolean = true) {
    const newScene = new scene(scene.name)
    newScene.init(this.engine, isViewport)
    this.scenes.set(newScene.id, newScene)
  }

  get(scene: SceneConstructor<Scene>) {
    return this.scenes.get(scene.name)
  }

  delete(scene: SceneConstructor<Scene>) {
    this.scenes.delete(scene.name)
  }

  loadScene(scene: SceneConstructor<Scene>) {
    if (this.currentScene) {
      this.removeFromStage(this.currentScene)
    }

    const newScene = this.scenes.get(scene.name)
    if (newScene) {
      newScene.onLoad()
      this.app.stage.addChildAt(newScene.view, 0)
      this.currentScene = newScene
    }
  }

  removeFromStage(scene: Scene) {
    const tmpScene = this.scenes.get(scene.id)
    if (tmpScene) {
      tmpScene.onUnLoad()
      tmpScene?.view.removeFromParent()
      //   tmpScene?.view.destroy()
    }
  }

  update(dt: number) {
    for (const scene of this.scenes.values()) {
      scene.update(dt)
    }
  }
}
