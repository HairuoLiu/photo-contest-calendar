import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'

// Relative base so the built site works on GitHub Pages project URLs
// (https://<user>.github.io/<repo>/) without extra routing config.
//
// GitHub Pages has no server-side router, so language deep links like
// /zh-CN, /en, /ja, /zh-TW would 404 on a hard refresh. Copying index.html
// to 404.html makes GitHub Pages serve the SPA shell for any unknown path;
// the SPA then reads the language from the URL and renders accordingly.
function copy404(): Plugin {
  let outDir = 'dist'
  return {
    name: 'copy-404',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      try {
        copyFileSync(`${outDir}/index.html`, `${outDir}/404.html`)
      } catch {
        /* ignore if index.html is missing */
      }
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), copy404()],
})
