import { beforeEach, describe, expect, it, vi } from "vitest";
import { GeminiClient } from "./client";

const MOCK_API_KEY = "test-api-key";
const REQUEST_COOLDOWN_MS = 1000;

const mocks = vi.hoisted(() => {
  const generateContent = vi.fn();
  const getGenerativeModel = vi.fn(() => ({
    generateContent,
  }));

  const GoogleGenerativeAI = vi.fn(function () {
    return {
      getGenerativeModel,
    };
  });

  return {
    generateContent,
    getGenerativeModel,
    GoogleGenerativeAI,
  };
});

vi.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: mocks.GoogleGenerativeAI,
}));

describe("GeminiClient", () => {
  let client: GeminiClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new GeminiClient({ apiKey: MOCK_API_KEY });
  });

  describe("generateCode", () => {
    it("should generate code successfully", async () => {
      const expectedCode = "function test() { return true; }";
      mocks.generateContent.mockResolvedValue({
        response: {
          text: () => expectedCode,
        },
      });

      const result = await client.generateCode("Create a test function");

      expect(result.code).toBe(expectedCode);
      expect(result.error).toBeUndefined();
    });

    it("should clean up markdown code blocks", async () => {
      const rawCode = "```javascript\nfunction test() {}\n```";
      const expectedCode = "function test() {}";
      mocks.generateContent.mockResolvedValue({
        response: {
          text: () => rawCode,
        },
      });

      const result = await client.generateCode("Create a test function");

      expect(result.code).toBe(expectedCode);
      expect(result.error).toBeUndefined();
    });

    it("should handle errors gracefully", async () => {
      const errorMessage = "API Error";
      mocks.generateContent.mockRejectedValue(new Error(errorMessage));

      const result = await client.generateCode("Create a test function");

      expect(result.code).toBe("");
      expect(result.error).toBe(errorMessage);
    });

    it("should include current code in prompt when provided", async () => {
      const currentCode = "function old() {}";
      const prompt = "Update the function";
      mocks.generateContent.mockResolvedValue({
        response: {
          text: () => "function new() {}",
        },
      });

      await client.generateCode(prompt, currentCode);

      const callArgs = mocks.generateContent.mock.calls[0][0];
      expect(callArgs).toContain(currentCode);
      expect(callArgs).toContain(prompt);
    });

    it("should queue requests with rate limiting", async () => {
      mocks.generateContent.mockResolvedValue({
        response: {
          text: () => "code",
        },
      });

      const startTime = Date.now();
      const promise1 = client.generateCode("req1");
      const promise2 = client.generateCode("req2");

      await Promise.all([promise1, promise2]);
      const duration = Date.now() - startTime;

      expect(duration).toBeGreaterThanOrEqual(REQUEST_COOLDOWN_MS);
    });
  });

  describe("explainCode", () => {
    it("should explain code successfully", async () => {
      const expectedExplanation = "This code does X.";
      mocks.generateContent.mockResolvedValue({
        response: {
          text: () => expectedExplanation,
        },
      });

      const result = await client.explainCode("function x() {}");

      expect(result.explanation).toBe(expectedExplanation);
      expect(result.error).toBeUndefined();
    });

    it("should handle errors gracefully", async () => {
      const errorMessage = "API Error";
      mocks.generateContent.mockRejectedValue(new Error(errorMessage));

      const result = await client.explainCode("function x() {}");

      expect(result.explanation).toBe("");
      expect(result.error).toBe(errorMessage);
    });

    it("should queue requests with rate limiting", async () => {
      mocks.generateContent.mockResolvedValue({
        response: {
          text: () => "explanation",
        },
      });

      const startTime = Date.now();
      const promise1 = client.explainCode("code1");
      const promise2 = client.explainCode("code2");

      await Promise.all([promise1, promise2]);
      const duration = Date.now() - startTime;

      expect(duration).toBeGreaterThanOrEqual(REQUEST_COOLDOWN_MS);
    });
  });

  describe("constructor", () => {
    it("should use default model when not specified", () => {
      void new GeminiClient({ apiKey: MOCK_API_KEY });

      expect(mocks.getGenerativeModel).toHaveBeenCalledWith({
        model: "gemini-2.0-flash-exp",
      });
    });

    it("should use custom model when specified", () => {
      const customModel = "gemini-pro";
      void new GeminiClient({
        apiKey: MOCK_API_KEY,
        modelName: customModel,
      });

      expect(mocks.getGenerativeModel).toHaveBeenCalledWith({
        model: customModel,
      });
    });
  });
});
