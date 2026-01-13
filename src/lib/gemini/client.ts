import type { GenerativeModel } from "@google/generative-ai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ExplainCodeResponse, GeminiClientConfig, GenerateCodeResponse } from "./types";

const DEFAULT_MODEL_NAME = "gemini-2.0-flash-exp";
const REQUEST_COOLDOWN_MS = 1000;

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error occurred";
}

function cleanMarkdownCodeBlocks(code: string): string {
  let cleaned = code.replace(/^```(?:javascript|js|typescript|ts)?\n?/gm, "");
  cleaned = cleaned.replace(/```\n?$/gm, "");
  return cleaned.trim();
}

function buildGenerateCodePrompt(userPrompt: string, currentCode?: string): string {
  const systemPrompt =
    "You are a Google Apps Script code generator.\n" +
    "Generate ONLY the requested Google Apps Script code without any explanations, comments, or markdown formatting.\n" +
    "Do not include ```javascript or any other markdown code blocks.\n" +
    "Return only the pure JavaScript/Google Apps Script code.";

  let fullPrompt = systemPrompt;

  if (currentCode) {
    fullPrompt +=
      "\n\nThe following is the current code in the editor:\n" +
      "```javascript\n" +
      `${currentCode}\n` +
      "```\n\n" +
      "Please modify this code according to the user's request. Return the COMPLETE updated code, not just the changes.";
  }

  fullPrompt += `\n\nUser request: ${userPrompt}`;
  return fullPrompt;
}

function buildExplainCodePrompt(code: string): string {
  return `Please explain the following Google Apps Script code:\n\n\`\`\`javascript\n${code}\n\`\`\``;
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class GeminiClient {
  private model: GenerativeModel;
  private generateCodeQueue = Promise.resolve<GenerateCodeResponse>({ code: "" });
  private explainCodeQueue = Promise.resolve<ExplainCodeResponse>({ explanation: "" });

  constructor(config: GeminiClientConfig) {
    const genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = genAI.getGenerativeModel({
      model: config.modelName || DEFAULT_MODEL_NAME,
    });
  }

  async generateCode(prompt: string, currentCode?: string): Promise<GenerateCodeResponse> {
    const fullPrompt = buildGenerateCodePrompt(prompt, currentCode);

    this.generateCodeQueue = this.generateCodeQueue.then(async () => {
      try {
        const result = await this.model.generateContent(fullPrompt);
        const response = await result.response;
        const rawCode = response.text();
        const code = cleanMarkdownCodeBlocks(rawCode);

        return { code };
      } catch (error) {
        console.error("Error generating code:", error);
        const errorMessage = extractErrorMessage(error);
        return { code: "", error: errorMessage };
      } finally {
        await delay(REQUEST_COOLDOWN_MS);
      }
    });

    return this.generateCodeQueue;
  }

  async explainCode(code: string): Promise<ExplainCodeResponse> {
    const prompt = buildExplainCodePrompt(code);

    this.explainCodeQueue = this.explainCodeQueue.then(async () => {
      try {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const explanation = response.text();

        return { explanation };
      } catch (error) {
        console.error("Error explaining code:", error);
        const errorMessage = extractErrorMessage(error);
        return { explanation: "", error: errorMessage };
      } finally {
        await delay(REQUEST_COOLDOWN_MS);
      }
    });

    return this.explainCodeQueue;
  }
}
