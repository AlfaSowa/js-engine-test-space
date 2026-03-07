import { Application } from 'pixi.js'
import { Engine } from '../core'
import { UiBox } from '../ui'

export class UiManager {
  engine!: Engine
  app!: Application

  uiBoxes = new Map<number, UiBox>()

  init(app: Application, engine: Engine) {
    this.app = app
    this.engine = engine
  }

  add(uiBox: UiBox): UiBox {
    this.uiBoxes.set(uiBox.view.uid, uiBox)
    uiBox.init(this.engine)

    return uiBox
  }

  delete(uiBox: UiBox) {
    this.uiBoxes.delete(uiBox.view.uid)
  }

  load(uiBox: UiBox) {
    const uiBoxTmp = this.uiBoxes.get(uiBox.view.uid)
    if (uiBoxTmp) {
      this.app.stage.addChild(uiBoxTmp.view)
    }
  }

  removeFromStage(uiBox: UiBox) {
    const uiBoxTmp = this.uiBoxes.get(uiBox.view.uid)
    if (uiBoxTmp) {
      uiBoxTmp?.view.removeFromParent()
      //   tmpScene?.view.destroy()
    }
  }

  update(dt: number) {
    for (const uiBox of this.uiBoxes.values()) {
      uiBox.update(dt)
    }
  }
}
