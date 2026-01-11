import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
})

const mockChrome = {
  identity: {
    getAuthToken: vi.fn(),
    removeAuthToken: vi.fn(),
  },
  runtime: {
    lastError: null,
  },
}

vi.stubGlobal('chrome', mockChrome)
global.fetch = vi.fn()
