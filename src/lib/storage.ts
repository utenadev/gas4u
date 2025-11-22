export enum StorageKey {
    GEMINI_API_KEY = 'GEMINI_API_KEY',
    GAS_ACCESS_TOKEN = 'GAS_ACCESS_TOKEN',
    PROJECTS = 'PROJECTS',
}

class StorageWrapper {
    private isExtension: boolean;

    constructor() {
        this.isExtension = typeof chrome !== 'undefined' && !!chrome.storage;
    }

    async get<T>(key: string): Promise<T | null> {
        if (this.isExtension) {
            return new Promise((resolve) => {
                chrome.storage.local.get([key], (result) => {
                    resolve(result[key] || null);
                });
            });
        } else {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        }
    }

    async set<T>(key: string, value: T): Promise<void> {
        if (this.isExtension) {
            return new Promise((resolve) => {
                chrome.storage.local.set({ [key]: value }, () => {
                    resolve();
                });
            });
        } else {
            localStorage.setItem(key, JSON.stringify(value));
            return Promise.resolve();
        }
    }

    async remove(key: string): Promise<void> {
        if (this.isExtension) {
            return new Promise((resolve) => {
                chrome.storage.local.remove(key, () => {
                    resolve();
                });
            });
        } else {
            localStorage.removeItem(key);
            return Promise.resolve();
        }
    }
}

export const storage = new StorageWrapper();
