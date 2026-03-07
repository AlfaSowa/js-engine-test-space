import { Graphics } from 'pixi.js'
import { Entity } from '../entities'
import { Component } from './component'

export class ColliderComponent implements Component {
  width: number = 0
  height: number = 0

  constructor(entity: Entity, showCollider = false) {
    this.width = entity.width
    this.height = entity.height

    if (showCollider) {
      entity.addChild(new Graphics().rect(0, 0, entity.width, entity.width).stroke({ color: 'red', width: 2 }))
    }
  }
}
