import { Vector2 } from '../../../utils'
import { Component } from './component'

export class PositionComponent implements Component {
  position!: Vector2

  constructor(position: Vector2) {
    this.position = position
  }
}
