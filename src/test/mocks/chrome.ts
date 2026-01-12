import { vi } from "vitest";

export const mockChrome = {
  runtime: {
    lastError: null as null | { message: string },
    getManifest: vi.fn(() => ({ version: "1.0.0" })),
    getURL: vi.fn((path: string) => `chrome-extension://mock-id/${path}`),
  },
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
      clear: vi.fn(),
    },
    sync: {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
      clear: vi.fn(),
    },
    onChanged: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
  },
  identity: {
    getAuthToken: vi.fn(),
    removeAuthToken: vi.fn(),
    removeCachedAuthToken: vi.fn(),
  },
  scripting: {
    executeScript: vi.fn(),
  },
  tabs: {
    query: vi.fn(),
    create: vi.fn(),
    sendMessage: vi.fn(),
  },
};
