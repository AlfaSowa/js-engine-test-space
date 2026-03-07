import { ObservablePoint } from 'pixi.js'
import { World } from '../../core'
import { EngineContext } from '../../engine-ctx'
import { SpatialHashGrid } from '../../utils'
import { ColliderComponent } from '../components'
import { System } from './system'
import { SYSTEM_PRIORITY } from './types'

const COLLISION_OVERLAP_SPEED = 300

export class CollisionSystem implements System {
  priority = SYSTEM_PRIORITY.SUPPORT

  grid: SpatialHashGrid

  constructor(grid: SpatialHashGrid) {
    this.grid = grid
  }

  update(ctx: EngineContext, dt: number): void {
    const world = ctx.get<World>(World)

    const entities = world.with(ColliderComponent)

    for (const entity of entities) {
      const candidates = this.grid.query(entity.position.x, entity.position.y)

      for (const collideredEntity of candidates) {
        if (entity.uid === collideredEntity.uid) continue

        const c1 = world.getComponent(entity, ColliderComponent)!
        const c2 = world.getComponent(collideredEntity, ColliderComponent)!

        if (this.testForAABB(entity.position, collideredEntity.position, c1, c2)) {
          this.resolve(entity.position, collideredEntity.position, c1, c2)
        }
      }
    }
  }

  resolve(p1: ObservablePoint, p2: ObservablePoint, c1: ColliderComponent, c2: ColliderComponent) {
    const overlapX = Math.min(p1.x + c1.width, p2.x + c2.width) - Math.max(p1.x, p2.x)

    const overlapY = Math.min(p1.y + c1.height, p2.y + c2.height) - Math.max(p1.y, p2.y)

    if (overlapX < overlapY) {
      if (p1.x < p2.x) {
        p1.x -= overlapX / COLLISION_OVERLAP_SPEED
        p2.x += overlapX / COLLISION_OVERLAP_SPEED
      } else {
        p1.x += overlapX / COLLISION_OVERLAP_SPEED
        p2.x -= overlapX / COLLISION_OVERLAP_SPEED
      }
    } else {
      if (p1.y < p2.y) {
        p1.y -= overlapY / COLLISION_OVERLAP_SPEED
        p2.y += overlapY / COLLISION_OVERLAP_SPEED
      } else {
        p1.y += overlapY / COLLISION_OVERLAP_SPEED
        p2.y -= overlapY / COLLISION_OVERLAP_SPEED
      }
    }
  }

  testForAABB = (p1: ObservablePoint, p2: ObservablePoint, c1: ColliderComponent, c2: ColliderComponent) => {
    return p1.x < p2.x + c2.width && p1.x + c1.width > p2.x && p1.y < p2.y + c2.height && p1.y + c1.height > p2.y
  }
}
