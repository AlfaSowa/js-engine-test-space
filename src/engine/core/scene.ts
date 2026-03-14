import { Viewport } from 'pixi-viewport'
import { Container, Graphics } from 'pixi.js'
import { Engine } from './engine'

export const WORLD_MAP_ACTIVE_W = 1000
export const WORLD_MAP_ACTIVE_H = 850

export const WORLD_MAP_W = WORLD_MAP_ACTIVE_W + 200

export class Scene {
  engine!: Engine
  id: string

  view: Container = new Container({
    isRenderGroup: true
  })

  viewport?: Viewport
  activeContainer: Container = new Container()

  constructor(id: string) {
    this.id = id
  }

  init(engine: Engine, isViewport: boolean = true) {
    this.engine = engine

    console.log('engine.app', engine.app)

    if (isViewport) {
      this.viewport = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: WORLD_MAP_W,
        worldHeight: window.innerHeight,
        events: engine.app.renderer.events
      })

      this.viewport.moveCenter(this.viewport.worldWidth / 2, this.viewport.worldHeight / 2)
      this.viewport.drag().clamp({ direction: 'all' })

      this.viewport.addChild(
        new Graphics().rect(0, 0, WORLD_MAP_W, window.innerHeight).fill({ color: 'rgba(149, 138, 122)' })
      )
      this.activeContainer.addChild(
        new Graphics().rect(0, 0, WORLD_MAP_ACTIVE_W, window.innerHeight).fill({ color: '#a8ae51' })
      )

      this.activeContainer.position.set(
        this.viewport.width / 2 - this.activeContainer.width / 2,
        this.viewport.height / 2 - this.activeContainer.height / 2
      )

      this.viewport.addChild(this.activeContainer)

      this.view.addChild(this.viewport)
    } else {
      this.view.addChild(
        new Graphics().rect(0, 0, engine.app.canvas.width, engine.app.canvas.height).fill({ color: '#a8ae51' })
      )
    }
  }

  onLoad(): void {
    console.log('load scene')
  }

  onUnLoad(): void {
    console.log('unload scene')
  }

  update(dt: number) {}
}
