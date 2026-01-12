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
