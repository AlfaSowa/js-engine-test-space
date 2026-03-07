export type EnemyType = 'warrior' | 'archer'

export type EnemyConfigType = {
  [key in EnemyType]: {
    health: number
    damage: number
    velocity: number
  }
}

export const enemyConfigs: EnemyConfigType = {
  warrior: {
    health: 150,
    damage: 10,
    velocity: 0.1
  },
  archer: {
    health: 80,
    damage: 20,
    velocity: 0.2
  }
}
