// Mock Chrome API for Web Preview
export const setupMockChrome = () => {
    if (typeof window === 'undefined') return;

    if (!window.chrome) {
        window.chrome = {} as any;
    }

    if (!window.chrome.runtime) {
        window.chrome.runtime = {
            id: 'mock-extension-id',
            getManifest: () => ({
                name: 'GAS4U (Mock)',
                version: '0.0.0',
                manifest_version: 3,
            }),
            getURL: (path: string) => `/${path}`,
        } as any;
    }

    if (!window.chrome.storage) {
        const createStorageArea = (areaName: string) => ({
            get: (_keys: string | string[] | Object | null, callback?: (items: any) => void) => {
                const data = JSON.parse(localStorage.getItem(`mock-storage-${areaName}`) || '{}');
                if (callback) callback(data);
                return Promise.resolve(data);
            },
            set: (items: Object, callback?: () => void) => {
                const current = JSON.parse(localStorage.getItem(`mock-storage-${areaName}`) || '{}');
                const updated = { ...current, ...items };
                localStorage.setItem(`mock-storage-${areaName}`, JSON.stringify(updated));
                if (callback) callback();
                return Promise.resolve();
            },
        });

        window.chrome.storage = {
            local: createStorageArea('local'),
            sync: createStorageArea('sync'),
            session: createStorageArea('session'),
            onChanged: { addListener: () => { } } as any,
        } as any;
    }
};
