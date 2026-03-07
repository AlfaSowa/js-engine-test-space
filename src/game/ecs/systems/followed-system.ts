import { World } from '../../../engine/core'
import { VelocityComponent } from '../../../engine/ecs/components'
import { System, SYSTEM_PRIORITY } from '../../../engine/ecs/systems'
import { EngineContext } from '../../../engine/engine-ctx'
import { FollowedComponent } from '../components'

export class FollowedSystem implements System {
  priority = SYSTEM_PRIORITY.LOW

  update(ctx: EngineContext, dt: number) {
    const world = ctx.get<World>(World)

    for (const entity of world.with(FollowedComponent, VelocityComponent)) {
      const velocity = world.getComponent(entity, VelocityComponent)!
      const followed = world.getComponent(entity, FollowedComponent)!

      if (entity.x !== followed.target.x || entity.y !== followed.target.y) {
        const delta = {
          x: followed.target.x + followed.target.width / 2 - entity.x - entity.width / 2,
          y: followed.target.y + followed.target.height / 2 - entity.y - entity.height / 2
        }

        const angle = Math.atan2(delta.y, delta.x)

        entity.x += Math.cos(angle) * velocity.velocity
        entity.y += Math.sin(angle) * velocity.velocity
      }
    }
  }
}
