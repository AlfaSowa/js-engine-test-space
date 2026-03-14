export type WeaponsIds = 'gun' | 'multyGun'

type TargetsType = 'target' | 'self'

export type WeaponsConfigType = {
  [key in WeaponsIds]: {
    id: WeaponsIds
    name: string
    target: TargetsType
  }
}

export const weaponsConfigs: WeaponsConfigType = {
  gun: {
    id: 'gun',
    name: 'Gun',
    target: 'target'
  },
  multyGun: {
    id: 'multyGun',
    name: 'MultyGun',
    target: 'target'
  }
}
