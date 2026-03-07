import { Engine, Scene } from '../../engine/core'
import { TowerDefenceManager } from '../managers'

export class MainScene extends Scene {
  init(engine: Engine, isViewport?: boolean): void {
    super.init(engine, isViewport)

    TowerDefenceManager.init(this.engine, this.view)
  }

  onLoad() {
    TowerDefenceManager.run(this.engine)
  }

  onUnLoad() {
    TowerDefenceManager.stop(this.engine)
  }
}
