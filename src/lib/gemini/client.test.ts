import { beforeEach, describe, expect, it, vi } from "vitest";
import { GeminiClient } from "./client";

const mocks = vi.hoisted(() => {
  const generateContent = vi.fn();
  const getGenerativeModel = vi.fn(() => ({
    generateContent: generateContent,
  }));
  // Use a standard function to allow 'new' usage
  const GoogleGenerativeAI = vi.fn(function (this: any) {
    return {
      getGenerativeModel: getGenerativeModel,
    };
  });
  return {
    generateContent,
    getGenerativeModel,
    GoogleGenerativeAI,
  };
});

vi.mock("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: mocks.GoogleGenerativeAI,
  };
});

describe("GeminiClient", () => {
  let client: GeminiClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new GeminiClient({ apiKey: "test-api-key" });
  });

  describe("generateCode", () => {
    it("should generate code successfully", async () => {
      mocks.generateContent.mockResolvedValue({
        response: {
          text: () => "function test() { return true; }",
        },
      });

      const result = await client.generateCode("Create a test function");
      expect(result.code).toBe("function test() { return true; }");
      expect(result.error).toBeUndefined();
    });

    it("should clean up markdown code blocks", async () => {
      mocks.generateContent.mockResolvedValue({
        response: {
          text: () => "```javascript\nfunction test() {}\n```",
        },
      });

      const result = await client.generateCode("Create a test function");
      expect(result.code).toBe("function test() {}");
    });

    it("should handle errors gracefully", async () => {
      mocks.generateContent.mockRejectedValue(new Error("API Error"));

      const result = await client.generateCode("Create a test function");
      expect(result.code).toBe("");
      expect(result.error).toBe("API Error");
    });

    // Rate limit testing
    it("should queue requests (rate limiting)", async () => {
      mocks.generateContent.mockResolvedValue({
        response: { text: () => "code" },
      });

      const start = Date.now();
      const p1 = client.generateCode("req1");
      const p2 = client.generateCode("req2");

      await Promise.all([p1, p2]);
      const duration = Date.now() - start;

      // Should take at least 1000ms (COOLDOWN) due to sequential execution
      expect(duration).toBeGreaterThanOrEqual(1000);
    });
  });

  describe("explainCode", () => {
    it("should explain code successfully", async () => {
      mocks.generateContent.mockResolvedValue({
        response: {
          text: () => "This code does X.",
        },
      });

      const result = await client.explainCode("function x() {}");
      expect(result.explanation).toBe("This code does X.");
    });
  });
});
