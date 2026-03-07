import { FederatedPointerEvent, Point } from 'pixi.js'
import { Component } from '../ecs/components'
import { Entity } from '../ecs/entities'

type EntityId = number
type ComponentConstructor<T> = new (...args: any[]) => T

const BITS_PER_WORD = 32
const DEFAULT_WORDS = 8 // 8 * 32 = 256 компонентов

type WorldEventData = {
  entityId?: number
  originalEvent: FederatedPointerEvent
  mouse?: Point
}

export class WorldTest {
  private entities = new Set<EntityId>()

  private entitiesMap = new Map<number, Entity>()

  // ComponentType -> (EntityId -> Component)
  private components = new Map<string, Map<EntityId, Component>>()

  // EntityId -> Signature (Uint32Array)
  private signatures = new Map<EntityId, Uint32Array>()

  // Component type registry
  private componentTypes = new Map<string, number>()
  private nextComponentType = 0

  private signatureWords = DEFAULT_WORDS

  listeners = new Map()

  private singletons = new Map<string, number>()

  // =============================
  // ENTITY
  // =============================

  public createEntity<T extends Entity>(supplier?: { new (): T }): T {
    const entity = supplier ? new supplier() : (new Entity() as T)

    this.entities.add(entity.uid)

    this.entitiesMap.set(entity.uid, entity)

    const signature = new Uint32Array(this.signatureWords)
    this.signatures.set(entity.uid, signature)

    return entity
  }

  public getEntity<T extends Entity>(entityId: number): T | null {
    const entity = this.entitiesMap.get(entityId)
    if (!entity) return null

    return entity as T
  }

  public destroyEntity(entity: Entity) {
    const id = entity.uid

    this.entities.delete(id)
    this.signatures.delete(id)

    for (const map of this.components.values()) {
      map.delete(id)
    }
  }

  // =============================
  // COMPONENT TYPE
  // =============================

  private getComponentType(componentClass: string): number {
    if (!this.componentTypes.has(componentClass)) {
      const typeIndex = this.nextComponentType++
      this.componentTypes.set(componentClass, typeIndex)

      // если превышаем capacity — расширяем сигнатуры
      if (typeIndex >= this.signatureWords * BITS_PER_WORD) {
        this.expandSignatures()
      }
    }

    return this.componentTypes.get(componentClass)!
  }

  private expandSignatures() {
    this.signatureWords++

    for (const [id, oldSig] of this.signatures) {
      const newSig = new Uint32Array(this.signatureWords)
      newSig.set(oldSig)
      this.signatures.set(id, newSig)
    }
  }

  // =============================
  // ADD COMPONENT
  // =============================

  public addComponent<C extends Component, E extends Entity>(entity: E, component: C) {
    const id = entity.uid
    const componentClass = component.constructor.name
    const typeIndex = this.getComponentType(componentClass)

    if (!this.components.has(componentClass)) {
      this.components.set(componentClass, new Map())
    }

    this.components.get(componentClass)?.set(id, component)

    const signature = this.signatures.get(id)!
    this.setBit(signature, typeIndex)
  }

  public removeComponent<C extends Component>(entity: Entity, componentClass: ComponentConstructor<C>) {
    const id = entity.uid
    const typeIndex = this.getComponentType(componentClass.name)

    this.components.get(componentClass.name)?.delete(id)

    const signature = this.signatures.get(id)!
    this.clearBit(signature, typeIndex)
  }

  public getComponent<C extends Component, E extends Entity>(
    entity: E,
    componentClass: ComponentConstructor<C>
  ): C | undefined {
    const componentMap = this.components.get(componentClass.name)

    // console.log('componentMap', componentMap, entity.uid)

    return componentMap ? (componentMap!.get(entity.uid) as C) : undefined
  }

  // =============================
  // QUERY
  // =============================

  public with(...componentClasses: ComponentConstructor<Component>[]): Entity[] {
    if (componentClasses.length === 0) return []

    const queryMask = new Uint32Array(this.signatureWords)

    for (const componentClass of componentClasses) {
      const typeIndex = this.getComponentType(componentClass.name)
      this.setBit(queryMask, typeIndex)
    }

    const result: Entity[] = []

    for (const entityId of this.entities) {
      const signature = this.signatures.get(entityId)
      if (!signature) continue

      if (this.matches(signature, queryMask)) {
        result.push(this.entitiesMap.get(entityId)!) // создаём entity по id
      }
    }

    return result
  }

  // =============================
  // BIT OPERATIONS
  // =============================

  private setBit(signature: Uint32Array, bitIndex: number) {
    const word = (bitIndex / BITS_PER_WORD) | 0
    const offset = bitIndex % BITS_PER_WORD
    signature[word] |= 1 << offset
  }

  private clearBit(signature: Uint32Array, bitIndex: number) {
    const word = (bitIndex / BITS_PER_WORD) | 0
    const offset = bitIndex % BITS_PER_WORD
    signature[word] &= ~(1 << offset)
  }

  private matches(signature: Uint32Array, queryMask: Uint32Array): boolean {
    for (let i = 0; i < this.signatureWords; i++) {
      if ((signature[i] & queryMask[i]) !== queryMask[i]) {
        return false
      }
    }
    return true
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
}
