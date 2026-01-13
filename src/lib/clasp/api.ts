import type { Chrome, GASFile } from "./types";

const chromeExtension = chrome as unknown as Chrome;

const MAX_RETRIES = 1;
const RETRY_DELAY_MS = 1000;
const BASE_URL = "https://script.googleapis.com/v1/projects";

export class GASClient {
  static async getAuthToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      chromeExtension.identity.getAuthToken({ interactive: true }, (token) => {
        const lastError = chromeExtension.runtime.lastError;

        if (lastError || !token) {
          reject(new Error(lastError?.message || "Failed to get auth token"));
          return;
        }

        resolve(token);
      });
    });
  }

  static async removeCachedAuthToken(token: string): Promise<void> {
    return new Promise((resolve) => {
      chromeExtension.identity.removeCachedAuthToken({ token }, resolve);
    });
  }

  private static async request(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<Response> {
    const token = await GASClient.getAuthToken();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401 && retryCount < MAX_RETRIES) {
      await GASClient.removeCachedAuthToken(token);
      return GASClient.request(endpoint, options, retryCount + 1);
    }

    return response;
  }

  private static async requestWithRetry(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<Response> {
    try {
      return await GASClient.request(endpoint, options, retryCount);
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        return GASClient.requestWithRetry(endpoint, options, retryCount + 1);
      }
      throw error;
    }
  }

  static async getContent(scriptId: string): Promise<GASFile[]> {
    const response = await GASClient.requestWithRetry(`/${scriptId}/content`);

    if (!response.ok) {
      const errorMessage = await response.text().catch(() => response.statusText);
      throw new Error(`Failed to fetch content: ${errorMessage}`);
    }

    const data = await response.json();
    return data.files ?? [];
  }

  static async updateContent(scriptId: string, files: GASFile[]): Promise<void> {
    const response = await GASClient.requestWithRetry(`/${scriptId}/content`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ files }),
    });

    if (!response.ok) {
      const errorMessage = await response.text().catch(() => response.statusText);
      throw new Error(`Failed to update content: ${errorMessage}`);
    }
  }
}
