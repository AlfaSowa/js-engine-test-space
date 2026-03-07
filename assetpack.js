import { json } from '@assetpack/core/json'
import { pixiPipes } from '@assetpack/core/pixi'

export default {
  entry: './src/assets/',
  output: './public/',
  pipes: [
    ...pixiPipes({
      compression: { jpg: true, png: true, webp: false },
      cacheBust: false
    }),
    json()
  ]
}
