import { Application, Assets } from 'pixi.js'
import manifest from '../../../public/manifest.json'
import { MovementSystem, SystemRunner, TimerSystem } from '../ecs/systems'
import { EngineContext } from '../engine-ctx'
import { SceneManager, UiManager } from '../managers'
import { World } from './world'

export class Engine {
  app: Application = new Application()

  //core
  systems: SystemRunner = new SystemRunner()
  engineContext = new EngineContext()

  //managers
  sceneManager: SceneManager = new SceneManager()
  uiManager: UiManager = new UiManager()

  world = new World()

  async init(canvas: HTMLElement) {
    await this.app.init({
      background: '#403d39',
      width: window.innerWidth,
      height: window.innerHeight,
      roundPixels: false,
      resolution: 1,
      preference: 'webgpu'
    })

    await Assets.init({ manifest })

    canvas!.appendChild(this.app.canvas)

    this.engineContext.register(World, this.world)
    this.engineContext.register(Application, this.app)
    this.engineContext.register(SceneManager, this.sceneManager)
    this.engineContext.register(SystemRunner, this.systems)

    this.systems.init(this.engineContext)

    this.systems.add(new MovementSystem())
    this.systems.add(new TimerSystem())

    this.sceneManager.init(this.app, this)
    this.uiManager.init(this.app, this)
  }

  start(update: (dt: number) => void) {
    this.app.ticker.add((ticker) => {
      const dt = ticker.deltaMS / 1000

      this.systems.update(dt)
      this.sceneManager.update(dt)
      update(dt)
    })

    console.log('this.world', this.world)
    console.log('this.systems', this.systems)
  }
}
