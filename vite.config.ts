import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx, defineManifest } from '@crxjs/vite-plugin'
import manifest from './src/manifest.json'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        crx({ manifest }),
    ],
    server: {
        port: 5173,
    },
})
