import { type GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import type { ExplainCodeResponse, GeminiClientConfig, GenerateCodeResponse } from "./types";

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private requestQueue: Promise<GenerateCodeResponse> = Promise.resolve({
    code: "",
    error: undefined,
  });
  private explainQueue: Promise<ExplainCodeResponse> = Promise.resolve({
    explanation: "",
    error: undefined,
  });
  private readonly REQUEST_COOLDOWN_MS = 1000;

  constructor(config: GeminiClientConfig) {
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: config.modelName || "gemini-2.0-flash-exp",
    });
  }

  async generateCode(prompt: string, currentCode?: string): Promise<GenerateCodeResponse> {
    const systemPrompt = `You are a Google Apps Script code generator.
Generate ONLY the requested Google Apps Script code without any explanations, comments, or markdown formatting.
Do not include \`\`\`javascript or any other markdown code blocks.
Return only the pure JavaScript/Google Apps Script code.`;

    let fullPrompt = systemPrompt;

    if (currentCode) {
      fullPrompt += `\n\nThe following is the current code in the editor:
\`\`\`javascript
${currentCode}
\`\`\`

Please modify this code according to the user's request. Return the COMPLETE updated code, not just the changes.`;
    }

    fullPrompt += `\n\nUser request: ${prompt}`;

    this.requestQueue = this.requestQueue.then(async () => {
      try {
        const result = await this.model.generateContent(fullPrompt);
        const response = await result.response;
        let code = response.text();

        code = code.replace(/^```(?:javascript|js|typescript|ts)?\n?/gm, "");
        code = code.replace(/```\n?$/gm, "");

        return { code: code.trim() };
      } catch (error) {
        console.error("Error generating code:", error);
        const message = error instanceof Error ? error.message : "Unknown error occurred";
        return { code: "", error: message };
      } finally {
        await new Promise((resolve) => setTimeout(resolve, this.REQUEST_COOLDOWN_MS));
      }
    });

    return this.requestQueue;
  }

  async explainCode(code: string): Promise<ExplainCodeResponse> {
    const prompt = `Please explain the following Google Apps Script code:\n\n\`\`\`javascript\n${code}\n\`\`\``;

    this.explainQueue = this.explainQueue.then(async () => {
      try {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return { explanation: response.text() };
      } catch (error) {
        console.error("Error explaining code:", error);
        const message = error instanceof Error ? error.message : "Unknown error occurred";
        return { explanation: "", error: message };
      } finally {
        await new Promise((resolve) => setTimeout(resolve, this.REQUEST_COOLDOWN_MS));
      }
    });

    return this.explainQueue;
  }
}
