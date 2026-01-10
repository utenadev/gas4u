import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { PromptInput } from '../components/PromptInput';
import { DiffViewer } from '../components/DiffViewer';
import { GeminiClient } from '../lib/gemini/client';
import { StorageManager } from '../lib/storage/manager';
import { ClaspManager } from '../lib/clasp/manager';
import '../index.css';

const EditorApp = () => {
    const [scriptId, setScriptId] = useState('');
    const [currentFileName, setCurrentFileName] = useState('Code');
    const [originalCode, setOriginalCode] = useState('function myFunction() {\n  // your code here\n}\n');
    const [modifiedCode, setModifiedCode] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLoadingProject, setIsLoadingProject] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [client, setClient] = useState<GeminiClient | null>(null);

    useEffect(() => {
        const initClient = async () => {
            const apiKey = await StorageManager.getApiKey();
            const lastId = (await StorageManager.getSettings()).lastProjectId;
            if (apiKey) {
                setClient(new GeminiClient({ apiKey }));
            }
            if (lastId) {
                setScriptId(lastId);
            }
        };
        initClient();
    }, []);

    const handleLoadProject = async () => {
        if (!scriptId) return;
        setIsLoadingProject(true);
        setError(null);
        try {
            const project = await ClaspManager.loadProject(scriptId);
            if (project) {
                setOriginalCode(project.code);
                setCurrentFileName(project.name);
                await StorageManager.saveSettings({ lastProjectId: scriptId });
            }
        } catch (e: any) {
            setError('Failed to load project: ' + e.message);
        } finally {
            setIsLoadingProject(false);
        }
    };

    const handleSaveProject = async () => {
        if (!scriptId) {
            setError('Please enter a Script ID first.');
            return;
        }
        setIsLoadingProject(true);
        setError(null);
        try {
            // Save the current working code (originalCode)
            // If there's pending modified code, user should accept it first.
            await ClaspManager.saveProject(scriptId, originalCode, currentFileName);
            alert('Successfully saved to GAS project!');
        } catch (e: any) {
            setError('Failed to save project: ' + e.message);
        } finally {
            setIsLoadingProject(false);
        }
    };

    const handlePromptSubmit = async (prompt: string) => {
        if (!client) {
            setError('API Key not found. Please set it in the extension popup.');
            return;
        }

        setIsGenerating(true);
        setError(null);

        const result = await client.generateCode(prompt, originalCode);

        if (result.error) {
            setError(result.error);
        } else {
            setModifiedCode(result.code);
        }
        setIsGenerating(false);
    };

    const handleAccept = () => {
        setOriginalCode(modifiedCode);
        setModifiedCode('');
    };

    const handleReject = () => {
        setModifiedCode('');
    };

    if (!client) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50 text-slate-500">
                Please set your API Key in the popup.
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-slate-50">
            {/* Top Bar: Project Settings */}
            <div className="bg-white border-b px-4 py-2 flex gap-2 items-center">
                <input
                    type="text"
                    placeholder="Script ID"
                    className="border rounded px-2 py-1 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={scriptId}
                    onChange={(e) => setScriptId(e.target.value)}
                />
                <button
                    onClick={handleLoadProject}
                    disabled={isLoadingProject || !scriptId}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm text-slate-700 disabled:opacity-50"
                >
                    {isLoadingProject ? 'Loading...' : 'Load'}
                </button>
                <button
                    onClick={handleSaveProject}
                    disabled={isLoadingProject || !scriptId}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm text-white disabled:opacity-50 ml-auto"
                >
                    Save to GAS
                </button>
            </div>

            {/* Header: AI Controls */}
            <header className="px-4 py-2 border-b bg-slate-50 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-2">
                    <h1 className="font-bold text-slate-700">GAS4U Editor</h1>
                    <span className="text-xs text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">{currentFileName}.gs</span>
                </div>
                {modifiedCode && (
                    <div className="flex gap-2">
                        <button
                            onClick={handleReject}
                            className="px-3 py-1 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 text-sm"
                        >
                            Reject
                        </button>
                        <button
                            onClick={handleAccept}
                            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
                        >
                            Accept
                        </button>
                    </div>
                )}
            </header>

            <main className="flex-1 overflow-hidden relative">
                {modifiedCode ? (
                    <DiffViewer
                        original={originalCode}
                        modified={modifiedCode}
                    />
                ) : (
                    <div className="p-0 h-full">
                        <textarea
                            className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none"
                            value={originalCode}
                            onChange={(e) => setOriginalCode(e.target.value)}
                        />
                    </div>
                )}

                {error && (
                    <div className="absolute bottom-4 left-4 right-4 p-3 bg-red-100 text-red-700 border border-red-200 rounded shadow-lg text-sm z-50">
                        {error}
                        <button onClick={() => setError(null)} className="float-right text-red-900 font-bold">&times;</button>
                    </div>
                )}
            </main>

            <footer className="z-10">
                <PromptInput
                    onSubmit={handlePromptSubmit}
                    isLoading={isGenerating}
                    placeholder="Describe functionality to add or change..."
                />
            </footer>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <EditorApp />
    </React.StrictMode>
);
