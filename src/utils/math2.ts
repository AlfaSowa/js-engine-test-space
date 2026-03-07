import { Container, Point } from 'pixi.js'
import { Vector2 } from './helpers'

//---isOnCanavasField ---//
type IsOnCanavasFieldProps = {
  position: Vector2
  radius: number
  ctx: CanvasRenderingContext2D
}

export const isOnCanavasField = ({ radius, position, ctx }: IsOnCanavasFieldProps): boolean => {
  return (
    position.x >= radius &&
    position.x <= ctx.canvas.width - radius &&
    position.y >= radius &&
    position.y <= ctx.canvas.height - radius
  )
}

//--getDistBetweenTargets--//
export const getDistBetweenTargets = <T>(
  targetA: T & { x: number; y: number },
  targetB: T & { x: number; y: number }
): number => {
  const delta = {
    x: targetA.x - targetB.x,
    y: targetA.y - targetB.y
  }

  // return Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2))
  return Math.hypot(targetA.x - targetB.x, targetA.y - targetB.y)
}

//--isTargetsColision--//
export const isTargetsColision = <T>(
  targetA: T & { x: number; y: number } & { radius: number },
  targetB: T & { x: number; y: number } & { radius: number }
): boolean => {
  return getDistBetweenTargets(targetA, targetB) < targetA.radius + targetB.radius
}

//--isTargetsColision--//
export const isContainersColision = (targetA: Container, targetB: Container, rA: number, rB: number): boolean => {
  // const delta = {
  //   x: targetA.groupTransform.tx + targetA.width / 2 - (targetB.groupTransform.tx + targetB.width / 2),
  //   y: targetA.groupTransform.ty + targetA.height / 2 - (targetB.groupTransform.ty + targetB.height / 2)
  // }

  const vCollision = new Point(targetB.x - targetA.x, targetB.y - targetA.y)
  // const dist = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2))
  const dist = Math.sqrt(
    (targetB.x - targetA.x) * (targetB.x - targetA.x) + (targetB.y - targetA.y) * (targetB.y - targetA.y)
  )

  const vCollisionNorm = new Point(vCollision.x / dist, vCollision.y / dist)

  console.log(vCollisionNorm)

  return dist < rA + rB
}

//--isTargetsRectColision--//
// type TargetSizeType = { width: number; height: number }

// export const IsTargetsRectColision = (
//   targetA: TargetType & TargetSizeType,
//   targetB: TargetType & TargetSizeType
// ): boolean => {
//   if (
//     targetA.position.x + targetA.width >= targetB.position.x &&
//     targetA.position.x <= targetB.position.x + targetB.width &&
//     targetA.position.y + targetA.height >= targetB.position.y &&
//     targetA.position.y <= targetB.position.y + targetB.height
//   ) {
//     return true
//   }

//   return false
// }

//--isMouseOnRectTarget--//
// type IsMouseOnRectTargetType = {
//   mouse: MouseType
//   target: any
// }

// export const isMouseOnRectTarget = ({ mouse, target }: IsMouseOnRectTargetType): boolean => {
//   return (
//     mouse.x > target.position.x &&
//     mouse.x < target.position.x + target.width &&
//     mouse.y > target.position.y &&
//     mouse.y < target.position.y + target.height
//   )
// }

//--isMouseOnCircleTarget--//
// type IsMouseOnCircleTargetType = {
//   mouse: MouseType
//   target: any
// }

// export const isMouseOnCircleTarget = ({ mouse, target }: IsMouseOnCircleTargetType): boolean => {
//   return (
//     mouse.x > target.position.x - target.radius &&
//     mouse.x < target.position.x + target.radius &&
//     mouse.y > target.position.y - target.radius &&
//     mouse.y < target.position.y + target.radius
//   )
// }

//--moveElementToTarget--//
export const moveElementToTarget = (element: Container, target: Container, velocity: number = 1) => {
  if (element.x !== target.x || element.y !== target.y) {
    const delta = {
      x: target.x - element.x,
      y: target.y - element.y
    }

    const angle = Math.atan2(delta.y, delta.x)

    element.x += Math.cos(angle) * velocity
    element.y += Math.sin(angle) * velocity
  }
}

//--moveElementToTarget--//
export const moveElementToContainer = (element: Container, target: Container, velocity: number = 1) => {
  if (
    element.groupTransform.tx !== target.groupTransform.tx ||
    element.groupTransform.ty !== target.groupTransform.ty
  ) {
    const delta = {
      x: target.groupTransform.tx + target.width / 2 - (element.groupTransform.tx + element.width / 2),
      y: target.groupTransform.ty + target.height / 2 - (element.groupTransform.ty + element.height / 2)
    }

    const angle = Math.atan2(delta.y, delta.x)

    element.x += Math.cos(angle) * velocity
    element.y += Math.sin(angle) * velocity
  }
}

//--setMousePosition--//
export const setMousePosition = (bild: any, { offsetX, offsetY }: MouseEvent) => {
  ;[bild.mouse.x, bild.mouse.y] = [offsetX, offsetY]
}

//--randomNumber--//
export const randomNumber = ([max, min]: number[]): number => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

//--unitMovement--//
export const unitMovement = (build: any, bounds: number = 0) => {
  if (
    isOnCanavasField({
      ctx: build.ctx,
      radius: build.radius,
      position: build.position
    })
  ) {
    if (build.KeyD) {
      build.position.x += build.velocity
    }
    if (build.KeyS) {
      build.position.y += build.velocity
    }
    if (build.KeyA) {
      build.position.x -= build.velocity
    }
    if (build.KeyW) {
      build.position.y -= build.velocity
    }
  }

  if (build.position.x < build.radius + build.velocity + bounds) {
    build.position.x = build.radius + build.velocity + bounds
  }
  if (build.position.x > build.ctx.canvas.width - (build.radius + build.velocity) - bounds) {
    build.position.x = build.ctx.canvas.width - (build.radius + build.velocity) - bounds
  }
  if (build.position.y < build.radius + build.velocity + bounds) {
    build.position.y = build.radius + build.velocity + bounds
  }
  if (build.position.y > build.ctx.canvas.height - (build.radius + build.velocity) - bounds) {
    build.position.y = build.ctx.canvas.height - (build.radius + build.velocity) - bounds
  }
}

//--getNearestTarget--//
export const getNearestTarget = <E, T>(
  entity: E & { x: number; y: number },
  targets: Array<T & { x: number; y: number }>
): [T, number] => {
  let distToNearestTarget: number = 99999
  let nearestTarget = targets[0]

  for (let i = 0; i < targets.length; i++) {
    const dist = getDistBetweenTargets<E | T>(entity, targets[i])

    if (dist < distToNearestTarget) {
      distToNearestTarget = dist
      nearestTarget = targets[i]
    }
  }

  return [nearestTarget, distToNearestTarget]
}

//--getNearestContainerTarget--//
export const getNearestContainerTarget = (element: Container, targets: Container[]): [Container, number] => {
  let distToNearestTarget: number = 99999
  let nearestTarget = targets[0]

  for (let i = 0; i < targets.length; i++) {
    const delta = {
      x: element.groupTransform.tx - targets[i].groupTransform.tx,
      y: element.groupTransform.ty - targets[i].groupTransform.ty
    }

    const dist = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2))

    if (dist < distToNearestTarget) {
      distToNearestTarget = dist
      nearestTarget = targets[i]
    }
  }

  return [nearestTarget, distToNearestTarget]
}
