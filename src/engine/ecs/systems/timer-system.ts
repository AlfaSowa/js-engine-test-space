import { World } from '../../core'
import { EngineContext } from '../../engine-ctx'
import { TimerComponent } from '../components/timer-component'
import { System } from './system'
import { SYSTEM_PRIORITY } from './types'

export class TimerSystem implements System {
  priority = SYSTEM_PRIORITY.LOW

  update(ctx: EngineContext, dt: number) {
    const world = ctx.get<World>(World)

    for (const entity of world.with(TimerComponent)) {
      const timer = world.getComponent(entity, TimerComponent)!

      timer.remaining -= dt

      if (timer.remaining <= 0) {
        timer.callback(entity)

        if (timer.repeat) {
          timer.remaining = timer.duration
        } else {
          world.removeComponent(entity, TimerComponent)
        }
      }
    }
  }
}
