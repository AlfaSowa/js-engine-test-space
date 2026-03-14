import { World } from '../../../engine/core'
import { System, SYSTEM_PRIORITY } from '../../../engine/ecs/systems'
import { EngineContext } from '../../../engine/engine-ctx'
import { WeaponComponent } from '../components'

export class WeaponSystem implements System {
  priority = SYSTEM_PRIORITY.LOW

  update(ctx: EngineContext, dt: number) {
    const world = ctx.get<World>(World)

    for (const entity of world.with(WeaponComponent)) {
      const weapon = world.getComponent(entity, WeaponComponent)!

      console.log(weapon.type)
    }
  }
}
