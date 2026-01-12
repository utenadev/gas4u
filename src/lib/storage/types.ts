export interface AppSettings {
  geminiApiKey?: string;
  lastProjectId?: string;
  theme?: "light" | "dark" | "system";
}

export const STORAGE_KEYS = {
  SETTINGS: "app_settings",
} as const;
