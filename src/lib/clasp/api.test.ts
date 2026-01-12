import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GASClient } from "./api";
import type { GASFile } from "./types";

describe("GASClient", () => {
  const mockToken = "mock-token";
  const mockScriptId = "test-script-id";
  const mockFiles: GASFile[] = [{ name: "Code", type: "SERVER_JS", source: "function test() {}" }];

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation for getAuthToken
    (chrome.identity.getAuthToken as any).mockImplementation(
      (_options: { interactive: boolean }, callback: (token?: string) => void) => {
        callback(mockToken);
      }
    );

    // Default mock implementation for removeCachedAuthToken
    (chrome.identity.removeCachedAuthToken as any).mockImplementation(
      (_details: { token: string }, callback: () => void) => {
        callback();
      }
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("getAuthToken", () => {
    it("should return token when successful", async () => {
      const token = await GASClient.getAuthToken();
      expect(token).toBe(mockToken);
      expect(chrome.identity.getAuthToken).toHaveBeenCalledWith(
        { interactive: true },
        expect.any(Function)
      );
    });

    it("should throw error when token is missing", async () => {
      (chrome.identity.getAuthToken as any).mockImplementation(
        (_options: { interactive: boolean }, callback: (token?: string) => void) => {
          callback(undefined);
        }
      );

      await expect(GASClient.getAuthToken()).rejects.toThrow("Failed to get auth token");
    });

    it("should throw error when runtime.lastError is set", async () => {
      chrome.runtime.lastError = { message: "Auth error" };
      (chrome.identity.getAuthToken as any).mockImplementation(
        (_options: { interactive: boolean }, callback: (token?: string) => void) => {
          callback(undefined);
        }
      );

      await expect(GASClient.getAuthToken()).rejects.toThrow("Auth error");
      chrome.runtime.lastError = null;
    });
  });

  describe("removeCachedAuthToken", () => {
    it("should call chrome.identity.removeCachedAuthToken", async () => {
      await GASClient.removeCachedAuthToken(mockToken);
      expect(chrome.identity.removeCachedAuthToken).toHaveBeenCalledWith(
        { token: mockToken },
        expect.any(Function)
      );
    });
  });

  describe("getContent", () => {
    it("should fetch content successfully", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ files: mockFiles }),
      } as Response);

      const files = await GASClient.getContent(mockScriptId);

      expect(files).toEqual(mockFiles);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/${mockScriptId}/content`),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`,
          }),
        })
      );
    });

    it("should retry on 401 error and refresh token", async () => {
      // First call returns 401
      // Second call returns 200
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          statusText: "Unauthorized",
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ files: mockFiles }),
        } as Response);

      const files = await GASClient.getContent(mockScriptId);

      expect(files).toEqual(mockFiles);
      expect(chrome.identity.removeCachedAuthToken).toHaveBeenCalledWith(
        { token: mockToken },
        expect.any(Function)
      );
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it("should throw error if retry fails", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
      } as Response);

      await expect(GASClient.getContent(mockScriptId)).rejects.toThrow();
      expect(global.fetch).toHaveBeenCalledTimes(2); // Initial + 1 retry
    });

    it("should retry on network error", async () => {
      global.fetch = vi
        .fn()
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ files: mockFiles }),
        } as Response);

      const files = await GASClient.getContent(mockScriptId);
      expect(files).toEqual(mockFiles);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe("updateContent", () => {
    it("should update content successfully", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as Response);

      await GASClient.updateContent(mockScriptId, mockFiles);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/${mockScriptId}/content`),
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ files: mockFiles }),
        })
      );
    });
  });
});
