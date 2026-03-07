import { Component } from './component'

export class VelocityComponent implements Component {
  velocity: number

  constructor(velocity: number) {
    this.velocity = velocity
  }
}
