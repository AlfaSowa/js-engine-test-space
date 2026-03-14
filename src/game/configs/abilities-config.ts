export type AbilitiesIds = 'fire'

type TargetsType = 'target' | 'self'

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
    target: TargetsType
    effects: Effect[]
  }
}

export const abilitiesConfigs: AbilitiesConfigType = {
  fire: {
    id: 'fire',
    name: 'Fire',
    target: 'target',
    effects: [
      {
        status: 'damage',
        duration: 0,
        type: 'fire',
        amount: 100
      }
    ]
  }
}
