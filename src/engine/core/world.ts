import { FederatedPointerEvent, Point } from 'pixi.js'
import { Component } from '../ecs/components'
import { Entity } from '../ecs/entities'

type ComponentConstructor<C extends Component> = new (...args: any[]) => C

type WorldEventData = {
  entityId?: number
  originalEvent: FederatedPointerEvent
  mouse?: Point
}
export class World {
  private entities = new Map<number, Entity>()
  private components = new Map<string, Map<Entity, Component>>()
  private singletons = new Map<string, number>()

  listeners = new Map()

  public createEntity<T extends Entity>(supplier?: { new (): T }): T {
    const entity = supplier ? new supplier() : (new Entity() as T)

    this.entities.set(entity.uid, entity)

    return entity
  }

  public getEntity<T extends Entity>(entityId: number): T | null {
    const entity = this.entities.get(entityId)
    if (!entity) return null

    return entity as T
  }

  public destroyEntity<E extends Entity>(entity: E) {
    this.entities.delete(entity.uid)

    for (const component of this.components.values()) {
      component.delete(entity)
    }
  }

  public addComponent<C extends Component, E extends Entity>(entity: E, component: C) {
    const type = component.constructor.name
    if (!this.components.has(type)) {
      this.components.set(type, new Map())
    }

    this.components.get(type)?.set(entity, component)
  }

  public removeComponent<C extends Component, E extends Entity>(entity: E, component: ComponentConstructor<C>) {
    const componentMap = this.components.get(component.name)
    if (componentMap) {
      componentMap.delete(entity)
    }
  }

  public getComponent<C extends Component, E extends Entity>(
    entity: E,
    component: ComponentConstructor<C>
  ): C | undefined {
    const componentMap = this.components.get(component.name)
    return componentMap ? (componentMap!.get(entity) as C) : undefined
  }

  public getSingleton<C extends Component>(component: ComponentConstructor<C>) {
    const id = this.singletons.get(component.name)
    if (!id) return null
    return this.getEntity(id)
  }

  public getOrCreateSingleton<C extends Component>(component: ComponentConstructor<C>, componentInstance: C) {
    const existing = this.getSingleton(component)
    if (existing) return existing

    const created = this.createEntity()

    this.addComponent(created, componentInstance)
    this.singletons.set(component.name, created.uid)

    return created
  }

  public with(...componentClasses: ComponentConstructor<Component>[]) {
    return [...this.entities.values()].filter((entity) => {
      return componentClasses.every((componentClass) => {
        return this.getComponent(entity, componentClass)
      })
    })
  }

  public withInstance(componentClass: ComponentConstructor<Component>) {
    const result: Entity[] = []

    for (const component of this.components.values()) {
      const value = component.values().next().value

      if (value && componentClass.prototype.isPrototypeOf(value.constructor.prototype)) {
        result.push(...component.keys())
      }
    }

    return result
  }

  on(eventName: string, callback: (arg: WorldEventData) => void) {
    let set = this.listeners.get(eventName)

    if (!set) {
      set = new Set()
      this.listeners.set(eventName, set)
    }

    set.add(callback)

    // удобно вернуть функцию для отписки
    return () => this.off(eventName, callback)
  }

  off(eventName: string, callback: (args: WorldEventData) => void) {
    const set = this.listeners.get(eventName)
    if (!set) return

    set.delete(callback)

    if (set.size === 0) {
      this.listeners.delete(eventName)
    }
  }

  emit(eventName: string, data: WorldEventData) {
    const set = this.listeners.get(eventName)
    if (!set) return

    // делаем копию, чтобы можно было отписываться во время вызова
    for (const cb of [...set]) {
      cb(data)
    }
  }
}
