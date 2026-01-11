import { describe, it, expect, vi } from 'vitest'

// Simple mock for chrome
if (typeof (globalThis as any).chrome === 'undefined') {
  ;(globalThis as any).chrome = {
    storage: {
      local: {
        get: vi.fn(),
        set: vi.fn(),
      },
    },
  }
}

describe('Initial Environment', () => {
  it('should have 1 + 1 = 2', () => {
    expect(1 + 1).toBe(2)
  })
})