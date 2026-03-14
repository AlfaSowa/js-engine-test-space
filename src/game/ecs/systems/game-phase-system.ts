import { World } from '../../../engine/core'
import { System, SYSTEM_PRIORITY } from '../../../engine/ecs/systems'
import { EngineContext } from '../../../engine/engine-ctx'
import { TowerDefenceManager } from '../../managers'
import { GAME_PHASE, GamePhaseComponent, WeaponComponent } from '../components'

export class GamePhaseSystem implements System {
  priority = SYSTEM_PRIORITY.LOW

  update(ctx: EngineContext, dt: number) {
    const world = ctx.get<World>(World)

    const gamePhaseEntity = world.getOrCreateSingleton(GamePhaseComponent, new GamePhaseComponent())
    const gamePhase = world.getComponent(gamePhaseEntity, GamePhaseComponent)

    const weaponEntity = world.getOrCreateSingleton(WeaponComponent, new WeaponComponent())
    const weapon = world.getComponent(weaponEntity, WeaponComponent)!

    if (gamePhase?.phase === GAME_PHASE.INIT) {
      console.log('GAME_PHASE.INIT')

      if (weapon.type) {
        TowerDefenceManager.run()
        gamePhase.phase = GAME_PHASE.START
      }
    }

    if (gamePhase?.phase === GAME_PHASE.START) {
      console.log('GAME_PHASE.START')
      gamePhase.phase = GAME_PHASE.PROGRESS
    }

    if (gamePhase?.phase === GAME_PHASE.PROGRESS) {
    }
  }
}
