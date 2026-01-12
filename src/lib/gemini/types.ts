export interface GenerateCodeResponse {
  code: string;
  error?: string;
}

export interface ExplainCodeResponse {
  explanation: string;
  error?: string;
}

export interface GeminiClientConfig {
  apiKey: string;
  modelName?: string;
}

// Method signatures for GeminiClient
export interface GeminiClientMethods {
  generateCode(prompt: string, currentCode?: string): Promise<GenerateCodeResponse>;
  explainCode(code: string): Promise<ExplainCodeResponse>;
}
