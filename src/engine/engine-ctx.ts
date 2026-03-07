export class EngineContext {
  services = new Map<string, Object>()

  register<T extends Object>(type: { new (): T }, service: T) {
    this.services.set(type.name, service)
  }

  get<T extends Object>(type: { new (): T }): T {
    return this.services.get(type.name) as T
  }
}
