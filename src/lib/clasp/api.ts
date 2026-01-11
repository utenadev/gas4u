import { GASFile } from './types'

interface ChromeIdentity {
  getAuthToken: (
    options: { interactive: boolean },
    callback: (token?: string) => void,
  ) => void
}

interface Chrome {
  identity: ChromeIdentity
  runtime: { lastError: chrome.runtime.LastError | null }
}

const chromeExtension = chrome as unknown as Chrome

export class GASClient {
  private static BASE_URL = 'https://script.googleapis.com/v1/projects'

  static async getAuthToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      chromeExtension.identity.getAuthToken({ interactive: true }, (token) => {
        if (chromeExtension.runtime.lastError || !token) {
          reject(
            new Error(
              chromeExtension.runtime.lastError?.message ||
                'Failed to get auth token',
            ),
          )
        } else {
          resolve(token)
        }
      })
    })
  }

  static async getAuthTokenWithRetry(maxRetries = 3): Promise<string> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const token = await this.getAuthToken()
        lastError = null

        return token
      } catch (error) {
        lastError =
          error instanceof Error ? error : new Error('Unknown error occurred')

        if (attempt < maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * (attempt + 1)),
          )
        }
      }
    }

    throw lastError || new Error('Failed to get valid auth token')
  }

  static async getContent(scriptId: string): Promise<GASFile[]> {
    const token = await this.getAuthTokenWithRetry()
    const response = await fetch(`${this.BASE_URL}/${scriptId}/content`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const err = await response.text().catch(() => response.statusText)
      throw new Error(`Failed to fetch content: ${err}`)
    }

    const data = await response.json()
    return data.files || []
  }

  static async updateContent(
    scriptId: string,
    files: GASFile[],
  ): Promise<void> {
    const token = await this.getAuthTokenWithRetry()
    const response = await fetch(`${this.BASE_URL}/${scriptId}/content`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ files }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText)
      throw new Error(`Failed to update content: ${errorText}`)
    }
  }
}
