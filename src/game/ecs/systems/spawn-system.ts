import { World } from '../../../engine/core'
import { TimerComponent } from '../../../engine/ecs/components/timer-component'
import { Entity } from '../../../engine/ecs/entities'
import { System, SYSTEM_PRIORITY } from '../../../engine/ecs/systems'
import { EngineContext } from '../../../engine/engine-ctx'
import { GAME_PHASE, GamePhaseComponent } from '../components'

export class SpawnSystem implements System {
  priority = SYSTEM_PRIORITY.LOW

  timerEntity!: Entity

  init(ctx: EngineContext): void {
    const world = ctx.get<World>(World)

    this.timerEntity = world.getOrCreateSingleton(
      TimerComponent,
      new TimerComponent(
        2,
        () => {
          console.log('timer')
        },
        true
      )
    )
  }

  destroyTimer(world: World) {
    world.destroyEntity(this.timerEntity)
  }

  setTimerOptions(ctx: EngineContext, duration: number, repeat: boolean, callback: (...args: any) => void) {
    const world = ctx.get<World>(World)

    const timer = world.getComponent(this.timerEntity, TimerComponent)

    if (timer) {
      timer.duration = duration
      timer.repeat = repeat
      timer.callback = callback
    }
  }

  update(ctx: EngineContext, dt: number) {
    const world = ctx.get<World>(World)

    const entity = world.getOrCreateSingleton(GamePhaseComponent, new GamePhaseComponent())
    const gamePhase = world.getComponent(entity, GamePhaseComponent)

    if (gamePhase?.phase === GAME_PHASE.PROGRESS) {
    }
  }
}
