import { AssetPack } from '@assetpack/core'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import { defineConfig, type Plugin, type ResolvedConfig } from 'vite'
import assetpackConfig from './assetpack'

function assetpackPlugin(): Plugin {
  let mode: ResolvedConfig['command']
  let ap: AssetPack | undefined

  return {
    name: 'vite-plugin-assetpack',
    configResolved(resolvedConfig) {
      mode = resolvedConfig.command
      if (!resolvedConfig.publicDir) return
      if (assetpackConfig.output) return
      const publicDir = resolvedConfig.publicDir.replace(process.cwd(), '')
      assetpackConfig.output = `.${publicDir}/assets/`
    },
    buildStart: async () => {
      if (mode === 'serve') {
        if (ap) return
        ap = new AssetPack(assetpackConfig)
        void ap.watch()
      } else {
        await new AssetPack(assetpackConfig).run()
      }
    },
    buildEnd: async () => {
      if (ap) {
        await ap.stop()
        ap = undefined
      }
    }
  }
}
// build.rollupOptions.external
export default defineConfig({
  plugins: [react(), assetpackPlugin()],
  css: {
    postcss: {
      plugins: [tailwindcss()]
    }
  },
  server: {
    port: 3001,
    open: true
  },
  build: {
    outDir: 'build',
    emptyOutDir: true
  }
})
