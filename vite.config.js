import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/biomarketplace/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        biobank: resolve(__dirname, 'biobank.html'),
      },
    },
  },
})
