import { Component } from '../../../engine/ecs/components'
import { WeaponsIds } from '../../configs'

export class WeaponComponent implements Component {
  type: WeaponsIds | null = null
}
