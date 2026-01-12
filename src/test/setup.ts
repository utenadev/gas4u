import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import { mockChrome } from './mocks/chrome'

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Mock Chrome API
vi.stubGlobal('chrome', mockChrome)

// Mock Monaco Editor
vi.mock('@monaco-editor/react', async () => {
  return await vi.importActual('./mocks/monaco')
})

// Mock fetch
global.fetch = vi.fn()

