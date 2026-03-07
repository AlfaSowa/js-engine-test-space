import { Container } from 'pixi.js'

//TODO перепроверить все вызовы
export const getDistBetweenContainers = <A extends Container, B extends Container>(tA: A, tB: B): number => {
  return Math.hypot(tA.x + tA.width / 2 - (tB.x + tB.width / 2), tA.y + tA.height / 2 - (tB.y + tB.height / 2))
}

const testForAABB = <A extends Container, B extends Container>(tA: A, tB: B) => {
  const bounds1 = tA.getBounds()
  const bounds2 = tB.getBounds()

  return (
    bounds1.x < bounds2.x + bounds2.width &&
    bounds1.x + bounds1.width > bounds2.x &&
    bounds1.y < bounds2.y + bounds2.height &&
    bounds1.y + bounds1.height > bounds2.y
  )
}

export const isContainersCollision = <A extends Container, B extends Container>(tA: A, tB: B): boolean => {
  return testForAABB(tA, tB)
}

export const moveContainerToContainer = <A extends Container, B extends Container>(
  tA: A,
  tB: B,
  velocity: number = 1
) => {
  if (tA.x !== tB.x || tA.y !== tB.y) {
    const delta = {
      x: tB.x + tB.width / 2 - tA.x,
      y: tB.y + tB.height / 2 - tA.y
    }

    const angle = Math.atan2(delta.y, delta.x)

    tA.x += Math.cos(angle) * velocity
    tA.y += Math.sin(angle) * velocity
  }
}

export const randomNumber = ([max, min]: number[]): number => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
