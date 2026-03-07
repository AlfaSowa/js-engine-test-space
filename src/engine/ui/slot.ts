import { Container, Graphics } from 'pixi.js'
import { Entity } from '../ecs/entities'

export class UiSlot extends Container {
  g: Graphics = new Graphics()
  constructor(width: number, height: number, color: string = '#f1f1f1') {
    super()

    this.g.rect(0, 0, width, height).fill({ color: color })
    this.addChild(this.g)
  }

  clicked(callback: (e: UiSlot, child: Entity | undefined) => void) {
    this.eventMode = 'static'
    this.cursor = 'pointer'

    this.on('pointerup', () => {
      const child = this.children.find((e) => !(e instanceof Graphics))
      callback.call(this, this, child)
    })

    return this
  }
}
