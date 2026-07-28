import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the built site works on GitHub Pages project URLs
// (https://<user>.github.io/<repo>/) without extra routing config.
export default defineConfig({
  base: './',
  plugins: [react()],
})
