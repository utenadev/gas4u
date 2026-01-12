import type { GASFile } from "./types";

interface ChromeIdentity {
  getAuthToken: (options: { interactive: boolean }, callback: (token?: string) => void) => void;
  removeCachedAuthToken: (details: { token: string }, callback?: () => void) => void;
}

interface Chrome {
  identity: ChromeIdentity;
  runtime: { lastError: chrome.runtime.LastError | null };
}

const chromeExtension = chrome as unknown as Chrome;

export class GASClient {
  private static BASE_URL = "https://script.googleapis.com/v1/projects";

  static async getAuthToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      chromeExtension.identity.getAuthToken({ interactive: true }, (token) => {
        if (chromeExtension.runtime.lastError || !token) {
          reject(
            new Error(chromeExtension.runtime.lastError?.message || "Failed to get auth token")
          );
        } else {
          resolve(token);
        }
      });
    });
  }

  static async removeCachedAuthToken(token: string): Promise<void> {
    return new Promise((resolve) => {
      chromeExtension.identity.removeCachedAuthToken({ token }, () => {
        resolve();
      });
    });
  }

  private static async request(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<Response> {
    try {
      const token = await GASClient.getAuthToken();
      const response = await fetch(`${GASClient.BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 && retryCount < 1) {
        // Token might be expired
        await GASClient.removeCachedAuthToken(token);
        return GASClient.request(endpoint, options, retryCount + 1);
      }

      return response;
    } catch (error) {
      if (retryCount < 1) {
        // Retry on network errors or other issues
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return GASClient.request(endpoint, options, retryCount + 1);
      }
      throw error;
    }
  }

  static async getContent(scriptId: string): Promise<GASFile[]> {
    const response = await GASClient.request(`/${scriptId}/content`);

    if (!response.ok) {
      const err = await response.text().catch(() => response.statusText);
      throw new Error(`Failed to fetch content: ${err}`);
    }

    const data = await response.json();
    return data.files || [];
  }

  static async updateContent(scriptId: string, files: GASFile[]): Promise<void> {
    const response = await GASClient.request(`/${scriptId}/content`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ files }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(`Failed to update content: ${errorText}`);
    }
  }
}
