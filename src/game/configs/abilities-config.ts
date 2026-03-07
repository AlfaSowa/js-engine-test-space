export type AbilitiesIds = 'fireball' | 'heal' | 'freez' | 'burn'

type TargetsType = 'enemy' | 'self'

export type EffectType = 'none' | 'fire' | 'cold'

export type StatusType = 'damage' | 'heal' | 'status'

export type Effect = {
  status: StatusType
  type: EffectType
  amount: number
  duration: number
}

export type AbilitiesConfigType = {
  [key in AbilitiesIds]: {
    id: AbilitiesIds
    name: string
    cost: number
    cooldown: number
    target: TargetsType
    effects: Effect[]
  }
}

export const abilitiesConfigs: AbilitiesConfigType = {
  fireball: {
    id: 'fireball',
    name: 'Fireball',
    target: 'enemy',
    cost: 0,
    cooldown: 0,
    effects: [
      {
        status: 'damage',
        duration: 0,
        type: 'fire',
        amount: 100
      },
      {
        status: 'status',
        duration: 3,
        type: 'fire',
        amount: 50
      }
    ]
  },
  freez: {
    id: 'freez',
    name: 'Freez',
    target: 'enemy',
    cost: 0,
    cooldown: 0,
    effects: [
      {
        status: 'status',
        duration: 3,
        type: 'cold',
        amount: 50
      }
    ]
  },
  burn: {
    id: 'burn',
    name: 'Burn',
    target: 'enemy',
    cost: 0,
    cooldown: 0,
    effects: [
      {
        status: 'status',
        duration: 2,
        type: 'fire',
        amount: 100
      }
    ]
  },
  heal: {
    id: 'heal',
    name: 'Heal',
    target: 'self',
    cost: 0,
    cooldown: 0,
    effects: [
      {
        status: 'heal',
        duration: 0,
        type: 'none',
        amount: 100
      }
    ]
  }
}
