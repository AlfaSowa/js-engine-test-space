import { World } from '../../core'
import { EngineContext } from '../../engine-ctx'
import { SpatialHashGrid } from '../../utils'
import { ColliderComponent } from '../components'
import { System } from './system'
import { SYSTEM_PRIORITY } from './types'

export class BroadPhaseSystem implements System {
  priority = SYSTEM_PRIORITY.INTERMEDIATE

  grid: SpatialHashGrid

  constructor(grid: SpatialHashGrid) {
    this.grid = grid
  }

  update(ctx: EngineContext, dt: number): void {
    const world = ctx.get<World>(World)

    this.grid.clear()

    for (const e of world.with(ColliderComponent)) {
      this.grid.insert(e, e.position.x, e.position.y)
    }
  }
}
