import { EngineContext } from '../../engine-ctx'
import { SYSTEM_PRIORITY } from './types'

export interface System {
  priority: SYSTEM_PRIORITY

  update?(ctx: EngineContext, dt: number): void

  onRemove?(ctx: EngineContext): void

  init?(ctx: EngineContext): void
}
