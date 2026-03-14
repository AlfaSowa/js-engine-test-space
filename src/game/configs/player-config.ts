import { WeaponsIds } from './weapons-config'

type PlayerConfigType = {
  detactionRadius: number
  texture: string
  weapons: WeaponsIds[]
}
export const playerConfig: PlayerConfigType = {
  detactionRadius: 300,
  texture: 'Castle.png',
  weapons: ['gun', 'multyGun']
}
