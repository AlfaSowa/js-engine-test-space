import { Scene } from '../../engine/core'
import { UiBox } from '../../engine/ui'
import { GAME_PHASE, GamePhaseComponent } from '../ecs'
import { TowerDefenceManager } from '../managers'
import { UiInterfaces } from '../ui'

export class MainScene extends Scene {
  uiBox: UiBox | null = null

  onLoad() {
    this.uiBox = UiInterfaces.weaponsGrid(this.engine)
    TowerDefenceManager.init(this.engine, this.view)
    this.engine.uiManager.load(this.uiBox)
  }

  onUnLoad() {
    TowerDefenceManager.stop()
    if (this.uiBox) {
      this.engine.uiManager.removeFromStage(this.uiBox)
      this.uiBox = null
    }
  }

  update(dt: number): void {
    const gamePhaseEntity = this.engine.world.getOrCreateSingleton(GamePhaseComponent, new GamePhaseComponent())
    const gamePhase = this.engine.world.getComponent(gamePhaseEntity, GamePhaseComponent)

    if (this.uiBox && gamePhase && gamePhase.phase === GAME_PHASE.PROGRESS) {
      this.engine.uiManager.removeFromStage(this.uiBox)
      this.uiBox = null
    }
  }
}
