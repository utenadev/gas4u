export interface GasProject {
    id: string;
    title: string;
    scriptId: string;
    parentId?: string;
}

export interface GasFile {
    name: string;
    type: 'SERVER_JS' | 'HTML' | 'JSON';
    source: string;
}

export class GasClient {
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    private async fetch(url: string, options: RequestInit = {}) {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`GAS API Error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    async listProjects(): Promise<GasProject[]> {
        // Note: The Drive API is usually used to list GAS projects (mimeType = application/vnd.google-apps.script)
        // Or the Apps Script API 'projects.list' if available/enabled.
        // For simplicity, we'll assume we use the Drive API v3 for listing.
        const q = "mimeType='application/vnd.google-apps.script' and trashed=false";
        const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name)`;

        const data = await this.fetch(url);
        return data.files.map((f: any) => ({
            id: f.id,
            title: f.name,
            scriptId: f.id, // scriptId is usually the file ID
        }));
    }

    async getProjectContent(scriptId: string): Promise<GasFile[]> {
        const url = `https://script.googleapis.com/v1/projects/${scriptId}/content`;
        const data = await this.fetch(url);
        return data.files;
    }

    async updateProjectContent(scriptId: string, files: GasFile[]): Promise<void> {
        const url = `https://script.googleapis.com/v1/projects/${scriptId}/content`;
        await this.fetch(url, {
            method: 'PUT',
            body: JSON.stringify({ files }),
        });
    }
}
