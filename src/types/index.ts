// Application Settings Types

export interface AppSettings {
  geminiApiKey?: string;
  lastProjectId?: string;
  theme?: Theme;
}

export type Theme = "light" | "dark" | "system";

// Storage Constants

export const STORAGE_KEY = "app_settings" as const;

// Google Apps Script Types

export interface GASProject {
  scriptId: string;
  title: string;
  files: GASFile[];
}

export interface GASFile {
  name: string;
  type: GASFileType;
  source: string;
}

export type GASFileType = "SERVER_JS" | "HTML" | "JSON";

// Chrome Extension API Types

export interface Chrome {
  identity: ChromeIdentity;
  runtime: ChromeRuntime;
}

export interface ChromeIdentity {
  getAuthToken(
    options: { interactive: boolean },
    callback: (token?: string) => void
  ): void;
  removeCachedAuthToken(
    details: { token: string },
    callback?: () => void
  ): void;
}

export interface ChromeRuntime {
  lastError: chrome.runtime.LastError | null;
}

// Gemini AI Types

export interface GeminiClientConfig {
  apiKey: string;
  modelName?: string;
}

export interface GeminiResponse {
  code?: string;
  explanation?: string;
  error?: string;
}

export interface GenerateCodeResponse {
  code: string;
  error?: string;
}

export interface ExplainCodeResponse {
  explanation: string;
  error?: string;
}
