import { World } from '../../core'
import { EngineContext } from '../../engine-ctx'
import { MovementComponent, VelocityComponent } from '../components'
import { System } from './system'
import { SYSTEM_PRIORITY } from './types'

type MoveMovesKeys = 'KeyW' | 'KeyA' | 'KeyS' | 'KeyD'

export class MovementSystem implements System {
  priority = SYSTEM_PRIORITY.LOW

  KeyW: boolean = false
  KeyA: boolean = false
  KeyS: boolean = false
  KeyD: boolean = false

  onKeyPress(e: KeyboardEvent, value: boolean) {
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
      this[e.code as MoveMovesKeys] = value
    }
  }

  init(): void {
    window.addEventListener('keydown', (e) => this.onKeyPress(e, true), false)
    window.addEventListener('keyup', (e) => this.onKeyPress(e, false), false)
  }

  update(ctx: EngineContext, dt: number): void {
    const world = ctx.get<World>(World)

    for (const entity of world.with(MovementComponent, VelocityComponent)) {
      const velocity = world.getComponent(entity, VelocityComponent)!

      if (this.KeyD) {
        entity.position.x += velocity.velocity * dt
      }
      if (this.KeyS) {
        entity.position.y += velocity.velocity * dt
      }
      if (this.KeyA) {
        entity.position.x -= velocity.velocity * dt
      }
      if (this.KeyW) {
        entity.position.y -= velocity.velocity * dt
      }
    }
  }
}
