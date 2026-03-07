import { Graphics } from 'pixi.js'

export const createTriangle = (x: number, y: number, color: string, size: number) => {
  const triangle = new Graphics()

  triangle.x = x
  triangle.y = y

  // draw triangle
  triangle.moveTo(0, -size)
  triangle.lineTo(size / 2, size / 2)
  triangle.lineTo(-size / 2, size / 2)
  triangle.fill(color)

  return triangle
}
