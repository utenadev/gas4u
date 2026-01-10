import { GASFile } from './types';

export class GASClient {
    private static BASE_URL = 'https://script.googleapis.com/v1/projects';

    static async getAuthToken(): Promise<string> {
        return new Promise((resolve, reject) => {
            chrome.identity.getAuthToken({ interactive: true }, (token) => {
                if (chrome.runtime.lastError || !token) {
                    // Improve error messaging for user
                    reject(new Error(chrome.runtime.lastError?.message || 'Failed to get auth token'));
                } else {
                    resolve(token);
                }
            });
        });
    }

    static async getContent(scriptId: string): Promise<GASFile[]> {
        const token = await this.getAuthToken();
        const response = await fetch(`${this.BASE_URL}/${scriptId}/content`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            // Handle 401/403 specifically if needed (token expired?)
            // For now just throw
            const err = await response.text().catch(() => response.statusText);
            throw new Error(`Failed to fetch content: ${err}`);
        }

        const data = await response.json();
        return data.files || [];
    }

    static async updateContent(scriptId: string, files: GASFile[]): Promise<void> {
        const token = await this.getAuthToken();
        const response = await fetch(`${this.BASE_URL}/${scriptId}/content`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ files }),
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => response.statusText);
            throw new Error(`Failed to update content: ${errorText}`);
        }
    }
}
