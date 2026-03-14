import { Graphics } from 'pixi.js'
import { Entity } from '../entities'
import { Component } from './component'

type ColliderType = 'rect' | 'circle'

export class ColliderComponent implements Component {
  width: number = 0
  height: number = 0
  colliderType: ColliderType = 'rect'

  constructor(entity: Entity, showCollider = false, colliderType: ColliderType = 'rect') {
    this.width = entity.width
    this.height = entity.height
    this.colliderType = colliderType

    if (showCollider) {
      if (colliderType === 'rect') {
        entity.addChild(new Graphics().rect(0, 0, entity.width, entity.width).stroke({ color: 'red', width: 2 }))
      }
      if (colliderType === 'circle') {
        entity.addChild(new Graphics().circle(0, 0, entity.width).stroke({ color: 'red', width: 2 }))
      }
    }
  }
}
