import { Container } from 'pixi.js'
import { getDistBetweenTargets } from './math2'

//--delayToCallback--//
export const delayToCallback = (interval: number, callback: (args?: any) => any) => {
  const state: { elapsed: number; interval: number } = { elapsed: interval, interval: interval }

  return {
    run: (delta: number, args?: any) => {
      state.elapsed += delta
      if (state.elapsed >= state.interval) {
        state.elapsed = 0
        callback(args)
      }
    },
    updateInterval: (interval: number) => {
      state.interval = interval
    },
    state
  }
}

//--removeElementFromArray--//
export const removeElementFromArray = <T>(array: T[], element: T) => {
  const index = array.indexOf(element)
  if (index > -1) {
    array.splice(index, 1)
  }
}

export const findInstance = (context: Container, newClass: any) => {
  return context.children.find((container) => container instanceof newClass)
}

//TODO добавить диагональных соседей
export const addSpotNeighbors = <T>(
  grid: Array<Array<T & { x: number; y: number }>>,
  spot: T & { x: number; y: number }
) => {
  const neighbors = []
  //top
  if (grid[spot.x]?.[spot.y - 1]) {
    neighbors.push(grid[spot.x][spot.y - 1])
  }
  //bottom
  if (grid[spot.x]?.[spot.y + 1]) {
    neighbors.push(grid[spot.x][spot.y + 1])
  }
  //left
  if (grid[spot.x - 1]?.[spot.y]) {
    neighbors.push(grid[spot.x - 1][spot.y])
  }
  //right
  if (grid[spot.x + 1]?.[spot.y]) {
    neighbors.push(grid[spot.x + 1][spot.y])
  }

  return neighbors
}

export const heuristic = <T>(
  a: T & { x: number; y: number },
  b: T & { x: number; y: number },
  allowDiagonals?: boolean
) => {
  if (allowDiagonals) {
    return getDistBetweenTargets<T>(a, b)
  }
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

export function debounce<T extends (...args: any[]) => any>(
  callback: T,
  ms: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timer: NodeJS.Timeout | undefined

  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer)
    }
    return new Promise<ReturnType<T>>((resolve) => {
      timer = setTimeout(() => {
        const returnValue = callback(...args) as ReturnType<T>
        resolve(returnValue)
      }, ms)
    })
  }
}
