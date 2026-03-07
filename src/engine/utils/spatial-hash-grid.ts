import { Entity } from '../ecs/entities'

const CELL_SIZE = 64

export class SpatialHashGrid {
  cellSize: number = CELL_SIZE
  cells = new Map()

  constructor(cellSize = CELL_SIZE) {
    this.cellSize = cellSize
  }

  clear() {
    this.cells.clear()
  }

  _key(x: number, y: number) {
    return `${x},${y}`
  }

  insert(entity: Entity, x: number, y: number) {
    const cx = Math.floor(x / this.cellSize)
    const cy = Math.floor(y / this.cellSize)

    const key = this._key(cx, cy)

    if (!this.cells.has(key)) {
      this.cells.set(key, [])
    }

    this.cells.get(key).push(entity)
  }

  query(x: number, y: number) {
    const cx = Math.floor(x / this.cellSize)
    const cy = Math.floor(y / this.cellSize)

    const result = []

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = this._key(cx + dx, cy + dy)

        if (this.cells.has(key)) {
          result.push(...this.cells.get(key))
        }
      }
    }

    return result
  }
}
