import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { PromptInput } from '../components/PromptInput';
import { DiffViewer } from '../components/DiffViewer';
import { GeminiClient } from '../lib/gemini/client';
import { StorageManager } from '../lib/storage/manager';
import '../index.css';

const EditorApp = () => {
    const [originalCode, setOriginalCode] = useState('function myFunction() {\n  // your code here\n}\n');
    const [modifiedCode, setModifiedCode] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [client, setClient] = useState<GeminiClient | null>(null);

    useEffect(() => {
        const initClient = async () => {
            const apiKey = await StorageManager.getApiKey();
            if (apiKey) {
                setClient(new GeminiClient({ apiKey }));
            }
        };
        initClient();
    }, []);

    const handlePromptSubmit = async (prompt: string) => {
        if (!client) {
            setError('API Key not found. Please set it in the extension popup.');
            return;
        }

        setIsGenerating(true);
        setError(null);

        // If we already have modified code (approved or not), use it as base?
        // For now, let's assume we always iterate on 'originalCode' (which should be current editor content)
        // In a real app, we'd sync this with the actual GAS editor.

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
        // TODO: Push to actual GAS editor
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
            <header className="px-4 py-2 border-b bg-white flex justify-between items-center shadow-sm">
                <h1 className="font-bold text-slate-700">GAS4U Generator</h1>
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
                    <div className="p-4 h-full">
                        <textarea
                            className="w-full h-full p-4 font-mono text-sm border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={originalCode}
                            onChange={(e) => setOriginalCode(e.target.value)}
                        />
                    </div>
                )}

                {error && (
                    <div className="absolute bottom-4 left-4 right-4 p-3 bg-red-100 text-red-700 border border-red-200 rounded shadow-lg text-sm">
                        {error}
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
