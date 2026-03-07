import { EngineContext } from '../../engine-ctx'
import { System } from './system'
import { SYSTEM_PRIORITY } from './types'

type SystemConstructor<S extends System> = new (...args: any[]) => S

export class SystemRunner {
  private systems: System[] = []
  private ctx!: EngineContext

  comporator = new Map<SYSTEM_PRIORITY, number>()

  public SystemManager() {
    this.comporator.set(SYSTEM_PRIORITY.LOW, 1)
    this.comporator.set(SYSTEM_PRIORITY.INTERMEDIATE, 2)
    this.comporator.set(SYSTEM_PRIORITY.SUPPORT, 3)
    this.comporator.set(SYSTEM_PRIORITY.HIGH, 4)
    this.comporator.set(SYSTEM_PRIORITY.DANGER, 5)
  }

  add<S extends System>(system: S): void {
    system.init?.(this.ctx)
    this.systems.push(system)

    this.systems.sort((a, b) => {
      return a.priority - b.priority
    })
  }

  init(ctx: EngineContext) {
    this.ctx = ctx
  }

  get<S extends System>(system: SystemConstructor<S>): S {
    return this.systems.find((s) => s.constructor.name === system.name) as S
  }

  remove<S extends System>(system: SystemConstructor<S>) {
    const s = this.get(system)

    s?.onRemove?.(this.ctx)
    this.systems = this.systems.filter((s) => !(s instanceof system))
  }

  update(dt: number) {
    for (const sistem of this.systems) {
      sistem.update?.(this.ctx, dt)
    }
  }
}
