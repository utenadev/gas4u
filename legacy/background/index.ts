import { storage, StorageKey } from '../lib/storage';
import { GasClient } from '../lib/gas';

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('GAS4U Extension installed');
});

async function getAuthToken(): Promise<string | null> {
    // 1. Try manual token from storage (for dev/testing)
    const manualToken = await storage.get<string>(StorageKey.GAS_ACCESS_TOKEN);
    if (manualToken) return manualToken;

    // 2. Try chrome.identity (requires manifest setup)
    return new Promise((resolve) => {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
            if (chrome.runtime.lastError) {
                console.log('Identity API Error:', chrome.runtime.lastError);
                resolve(null);
            } else {
                resolve(token || null);
            }
        });
    });
}

// Listen for messages from Popup or Editor
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'GET_PROJECTS') {
        (async () => {
            try {
                const token = await getAuthToken();
                if (token) {
                    const client = new GasClient(token);
                    const projects = await client.listProjects();
                    // Cache projects
                    await storage.set(StorageKey.PROJECTS, projects);
                    sendResponse({ projects });
                } else {
                    // Fallback to cache
                    const projects = await storage.get(StorageKey.PROJECTS);
                    sendResponse({ projects: projects || [], error: 'No auth token available' });
                }
            } catch (error) {
                console.error('Failed to fetch projects:', error);
                const projects = await storage.get(StorageKey.PROJECTS);
                sendResponse({ projects: projects || [], error: String(error) });
            }
        })();
        return true; // Indicates async response
    }

    if (message.type === 'GET_PROJECT_CONTENT') {
        (async () => {
            try {
                const token = await getAuthToken();
                if (!token) {
                    sendResponse({ error: 'No auth token available' });
                    return;
                }
                const client = new GasClient(token);
                const files = await client.getProjectContent(message.scriptId);
                sendResponse({ files });
            } catch (error) {
                console.error('Failed to fetch project content:', error);
                sendResponse({ error: String(error) });
            }
        })();
        return true;
    }

    if (message.type === 'UPDATE_PROJECT_CONTENT') {
        (async () => {
            try {
                const token = await getAuthToken();
                if (!token) {
                    sendResponse({ error: 'No auth token available' });
                    return;
                }
                const client = new GasClient(token);
                await client.updateProjectContent(message.scriptId, message.files);
                sendResponse({ success: true });
            } catch (error) {
                console.error('Failed to update project content:', error);
                sendResponse({ error: String(error) });
            }
        })();
        return true;
    }

    if (message.type === 'OPEN_EDITOR') {
        const editorUrl = chrome.runtime.getURL('src/editor/index.html');
        chrome.tabs.create({ url: `${editorUrl}?projectId=${message.projectId}` });
    }
});
