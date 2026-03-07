import { Container, Graphics } from 'pixi.js'

type DrawSquareFieldsType = {
  container: Container
  xAmount: number
  yAmount?: number
  gap?: number
  renderElementFx?: () => Container
}
export const drawSquareFields = ({ container, xAmount, yAmount, gap, renderElementFx }: DrawSquareFieldsType) => {
  for (let i = 0; i < (yAmount ? yAmount * xAmount : xAmount * xAmount); i++) {
    let field = renderElementFx ? renderElementFx() : new Container()

    if (!renderElementFx) {
      const g = new Graphics().rect(0, 0, 50, 50).fill({ color: '#f1f1f1' }).stroke(0x00ff00)
      field.addChild(g)
    }

    field.position.set(
      (i % xAmount) * field.width + (gap && i % xAmount > 0 ? gap * (i % xAmount) : 0),
      Math.floor(i / xAmount) * field.height + (gap && Math.floor(i / xAmount) > 0 ? gap * Math.floor(i / xAmount) : 0)
    )

    container.addChild(field)
  }
}
