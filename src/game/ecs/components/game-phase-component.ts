import { Component } from '../../../engine/ecs/components'

export enum GAME_PHASE {
  INIT,
  START,
  PROGRESS,
  END
}

export class GamePhaseComponent implements Component {
  phase: GAME_PHASE = GAME_PHASE.INIT
}
