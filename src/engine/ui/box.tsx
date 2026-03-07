import { Container, Graphics } from 'pixi.js'
import { Vector2 } from '../../utils'
import { Engine } from '../core'

const PADDING = 20

export class UiBox {
  engine!: Engine
  view: Container = new Container()
  g: Graphics = new Graphics()
  color: string

  constructor(position: Vector2, color: string = 'rgba(43, 43,43, 1)') {
    this.color = color
    this.view.position.set(position.x, position.y)

    this.resize()
  }

  addContainer(container: Container) {
    this.view.addChild(container)
  }

  init(engine: Engine) {
    this.engine = engine
  }

  resize() {
    this.g.clear()
    this.g.rect(0, 0, this.view.width, this.view.height).fill({ color: this.color })
    this.view.addChildAt(this.g, 0)
  }

  update(dt: number) {}
}
