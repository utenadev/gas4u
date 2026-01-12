import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StorageManager } from './manager';
import { STORAGE_KEYS } from './types';

describe('StorageManager', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getSettings', () => {
        it('should return empty object if no settings found', async () => {
            // Mock chrome.storage.local.get to return empty object
            vi.mocked(chrome.storage.local.get).mockResolvedValue({});

            const settings = await StorageManager.getSettings();
            expect(settings).toEqual({});
            expect(chrome.storage.local.get).toHaveBeenCalledWith(STORAGE_KEYS.SETTINGS);
        });

        it('should return settings if found', async () => {
            const mockSettings = { geminiApiKey: 'test-key' };
            vi.mocked(chrome.storage.local.get).mockResolvedValue({
                [STORAGE_KEYS.SETTINGS]: mockSettings
            });

            const settings = await StorageManager.getSettings();
            expect(settings).toEqual(mockSettings);
        });

        it('should return empty object on error', async () => {
            vi.mocked(chrome.storage.local.get).mockRejectedValue(new Error('Storage error'));

            // Should catch error and return empty object
            const settings = await StorageManager.getSettings();
            expect(settings).toEqual({});
        });
    });

    describe('saveSettings', () => {
        it('should merge and save new settings', async () => {
            // Mock existing settings
            vi.mocked(chrome.storage.local.get).mockResolvedValue({
                [STORAGE_KEYS.SETTINGS]: { existingKey: 'old' }
            });
            vi.mocked(chrome.storage.local.set).mockResolvedValue(undefined);

            await StorageManager.saveSettings({ geminiApiKey: 'new' });

            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [STORAGE_KEYS.SETTINGS]: { existingKey: 'old', geminiApiKey: 'new' }
            });
        });

        it('should throw error on failure', async () => {
            // Mock error on set
            vi.mocked(chrome.storage.local.set).mockRejectedValue(new Error('Save failed'));

            await expect(StorageManager.saveSettings({ geminiApiKey: 'fail' }))
                .rejects.toThrow('Save failed');
        });
    });
});
