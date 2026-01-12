import { type AppSettings, STORAGE_KEYS } from "./types";

export class StorageManager {
  /**
   * Retrieves the current application settings.
   */
  static async getSettings(): Promise<AppSettings> {
    try {
      const result = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS);
      return result[STORAGE_KEYS.SETTINGS] || {};
    } catch (error) {
      console.error("Failed to get settings:", error);
      return {};
    }
  }

  /**
   * Saves or updates the application settings.
   * Merges with existing settings.
   */
  static async saveSettings(settings: Partial<AppSettings>): Promise<void> {
    try {
      const current = await StorageManager.getSettings();
      const updated = { ...current, ...settings };
      await chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: updated });
    } catch (error) {
      console.error("Failed to save settings:", error);
      throw error;
    }
  }

  /**
   * Helper to get the Gemini API Key.
   */
  static async getApiKey(): Promise<string | undefined> {
    const settings = await StorageManager.getSettings();
    return settings.geminiApiKey;
  }

  /**
   * Helper to set the Gemini API Key.
   */
  static async setApiKey(apiKey: string): Promise<void> {
    await StorageManager.saveSettings({ geminiApiKey: apiKey });
  }
}
