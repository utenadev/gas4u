import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { PromptInput } from '../components/PromptInput';
import { DiffViewer } from '../components/DiffViewer';
import Editor from '@monaco-editor/react';
import { GeminiClient } from '../lib/gemini/client';
import { StorageManager } from '../lib/storage/manager';
import { ClaspManager } from '../lib/clasp/manager';
import '../index.css';

export const EditorApp = () => {
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
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            setError('Failed to load project: ' + message);
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
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            setError('Failed to save project: ' + message);
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
            <div className="bg-white border-b border-slate-200 px-6 py-3 flex gap-4 items-center shadow-sm z-20">
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-lg">G</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700 leading-tight">GAS4U Project</span>
                        <span className="text-xs text-slate-400">{currentFileName}.gs</span>
                    </div>
                </div>

                <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
                    <input
                        type="text"
                        placeholder="Script ID"
                        className="bg-transparent px-3 py-1.5 text-sm w-48 focus:outline-none text-slate-700 placeholder:text-slate-400"
                        value={scriptId}
                        onChange={(e) => setScriptId(e.target.value)}
                    />
                    <button
                        onClick={handleLoadProject}
                        disabled={isLoadingProject || !scriptId}
                        className="px-4 py-1.5 bg-white hover:bg-slate-50 rounded-md text-sm font-medium text-slate-700 shadow-sm border border-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoadingProject ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading
                            </span>
                        ) : 'Load'}
                    </button>
                </div>

                <div className="border-l border-slate-200 h-8 mx-2"></div>

                <button
                    onClick={handleSaveProject}
                    disabled={isLoadingProject || !scriptId}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white shadow-sm shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Save to GAS
                </button>
            </div>

            {/* Header: AI Controls */}


            <main className="flex-1 overflow-hidden relative">
                {modifiedCode ? (
                    <DiffViewer
                        original={originalCode}
                        modified={modifiedCode}
                    />
                ) : (

                    <div className="h-full w-full">
                        <Editor
                            height="100%"
                            defaultLanguage="javascript"
                            language="javascript"
                            value={originalCode}
                            onChange={(value) => setOriginalCode(value || '')}
                            theme="light"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                            }}
                        />
                    </div>
                )
                }


                {modifiedCode && (
                    <div className="absolute top-4 right-4 z-50 flex gap-2 animate-fade-in">
                        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-1.5 flex gap-2">
                            <button
                                onClick={handleReject}
                                className="px-3 py-1.5 rounded-md hover:bg-red-50 text-red-600 text-xs font-medium transition-colors flex items-center gap-1"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                Reject
                            </button>
                            <button
                                onClick={handleAccept}
                                className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition-colors flex items-center gap-1"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Accept Changes
                            </button>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 min-w-[300px] p-4 bg-white border-l-4 border-red-500 rounded-r shadow-xl z-50 animate-slide-up flex justify-between items-start gap-3">
                        <div className="flex-1">
                            <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Error</h4>
                            <p className="text-sm text-slate-600">{error}</p>
                        </div>
                        <button onClick={() => setError(null)} className="text-slate-400 hover:text-slate-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                )}
            </main >

            <footer className="z-10">
                <PromptInput
                    onSubmit={handlePromptSubmit}
                    isLoading={isGenerating}
                    placeholder="Describe functionality to add or change..."
                />
            </footer>
        </div >
    );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <EditorApp />
    </React.StrictMode>
);
