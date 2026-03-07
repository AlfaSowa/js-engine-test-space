import { Component } from '../../../engine/ecs/components'
import { Entity } from '../../../engine/ecs/entities'

export class FollowedComponent implements Component {
  target: Entity

  constructor(target: Entity) {
    this.target = target
  }
}
