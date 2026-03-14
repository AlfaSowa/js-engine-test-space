import { World } from '../../../engine/core'
import { Entity } from '../../../engine/ecs/entities'
import { System, SYSTEM_PRIORITY } from '../../../engine/ecs/systems'
import { EngineContext } from '../../../engine/engine-ctx'
import { EnemyComponent, PlayerTowerComponent } from '../components'

export class PlayerCollisionSystem implements System {
  priority = SYSTEM_PRIORITY.SUPPORT

  update(ctx: EngineContext, dt: number) {
    const world = ctx.get<World>(World)

    const playerEntity = world.getOrCreateSingleton(PlayerTowerComponent, new PlayerTowerComponent())

    for (const entity of world.with(EnemyComponent)) {
      const enemy = world.getComponent(entity, EnemyComponent)!

      if (this.testForAABB(playerEntity, entity)) {
        // world.removeComponent(entity, EnemyComponent)
        // world.removeComponent(entity, ColliderComponent)
        entity.removeAllListeners()
        entity.removeFromParent()
        entity.destroy()
        world.destroyEntity(entity)
      }
    }
  }

  testForAABB = (e1: Entity, e2: Entity) => {
    const b1 = e1.getBounds()
    const b2 = e2.getBounds()

    return b1.x < b2.x + b2.width && b1.x + b1.width > b2.x && b1.y < b2.y + b2.height && b1.y + b1.height > b2.y
  }

  circleCollision(e1: Entity, e2: Entity) {
    const b1 = e1.getBounds()
    const b2 = e2.getBounds()

    const dx = b1.x - b2.x
    const dy = b1.y - b2.y

    const distanceSq = dx * dx + dy * dy
    const radiusSum = b1.width + b2.width

    return distanceSq < radiusSum * radiusSum
  }
}
