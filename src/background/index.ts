import { storage, StorageKey } from '../lib/storage';

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('GAS4U Extension installed');
});

// Listen for messages from Popup or Editor
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'GET_PROJECTS') {
        // In a real scenario, this would fetch from Apps Script API
        // For now, we return mock data or data from storage
        storage.get(StorageKey.PROJECTS).then((projects) => {
            sendResponse({ projects: projects || [] });
        });
        return true; // Indicates async response
    }

    if (message.type === 'OPEN_EDITOR') {
        const editorUrl = chrome.runtime.getURL('src/editor/index.html');
        chrome.tabs.create({ url: `${editorUrl}?projectId=${message.projectId}` });
    }
});
