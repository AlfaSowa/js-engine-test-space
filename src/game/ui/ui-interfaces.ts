import { BitmapText } from 'pixi.js'
import { Engine } from '../../engine/core'
import { UiBox, UiSlot } from '../../engine/ui'
import { Vector2 } from '../../utils'
import { MainScene } from '../scenes'

const BUTTONS_HEIGHT = 50

export class UiInterfaces {
  static crateMainMenuInteface(engine: Engine): UiBox {
    const uiBox = engine.uiManager.add(new UiBox(new Vector2(0, 0), 'rgba(0, 0, 0, 0)'))

    const buttonWidth = engine.app.canvas.width >= 400 ? 360 : engine.app.canvas.width - 20

    //первая кнопка меню
    const startBtnText = new BitmapText({
      text: 'Старт!',
      style: {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 'rgb(14, 14, 14)'
      }
    })

    const startBtnSlot = new UiSlot(buttonWidth, BUTTONS_HEIGHT, 'rgba(101, 101, 101, 0.7)')

    startBtnSlot.clicked((f) => {
      console.log(f)
      console.log(this)

      engine.sceneManager.loadScene(MainScene)
    })

    startBtnText.position.x = startBtnSlot.width / 2 - startBtnText.width / 2
    startBtnText.position.y = startBtnSlot.height / 2 - startBtnText.height / 2

    startBtnSlot.addChild(startBtnText)

    uiBox.addContainer(startBtnSlot)

    uiBox.view.position.set(engine.app.canvas.width / 2 - uiBox.view.width / 2, 200)

    uiBox.resize()

    return uiBox
  }
}
