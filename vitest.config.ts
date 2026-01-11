/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    environment: 'jsdom', // web extension environment typically needs dom
    globals: true,
  },
})
