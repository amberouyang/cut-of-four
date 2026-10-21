import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // the site lives at amberouyang.github.io/cut-of-four/ on GitHub Pages
  base: '/cut-of-four/',
  plugins: [react(), tailwindcss()],
})
