import type { AppSettings } from "./types";
import { STORAGE_KEY } from "./types";

function getSettingsFromStorage(result: Record<string, unknown>): AppSettings {
  return result[STORAGE_KEY] ? (result[STORAGE_KEY] as AppSettings) : {};
}

export class StorageManager {
  static async getSettings(): Promise<AppSettings> {
    try {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      return getSettingsFromStorage(result);
    } catch (error) {
      console.error("Failed to get settings:", error);
      return {};
    }
  }

  static async saveSettings(settings: Partial<AppSettings>): Promise<void> {
    const current = await StorageManager.getSettings();
    const updated = { ...current, ...settings };

    try {
      await chrome.storage.local.set({ [STORAGE_KEY]: updated });
    } catch (error) {
      console.error("Failed to save settings:", error);
      throw error;
    }
  }

  static async getApiKey(): Promise<string | undefined> {
    const settings = await StorageManager.getSettings();
    return settings.geminiApiKey;
  }

  static async setApiKey(apiKey: string): Promise<void> {
    await StorageManager.saveSettings({ geminiApiKey: apiKey });
  }
}
