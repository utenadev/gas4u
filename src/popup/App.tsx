import React, { useEffect, useState } from 'react';
import { StorageManager } from '../lib/storage/manager';

export const App = () => {
    const [apiKey, setApiKey] = useState('');
    const [status, setStatus] = useState<string>('');

    useEffect(() => {
        StorageManager.getApiKey().then((key) => {
            if (key) setApiKey(key);
        });
    }, []);

    const handleSave = async () => {
        try {
            await StorageManager.setApiKey(apiKey);
            setStatus('Saved successfully!');
            setTimeout(() => setStatus(''), 2000);
        } catch (error) {
            console.error(error);
            setStatus('Error saving settings.');
        }
    };

    return (
        <div className="p-4 flex flex-col gap-4">
            <h1 className="text-xl font-bold text-slate-900 border-b pb-2">GAS4U Settings</h1>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Gemini API Key</label>
                <input
                    type="password"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API Key"
                />
                <p className="text-xs text-gray-500">
                    Get your key from <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>.
                </p>
            </div>

            <button
                onClick={handleSave}
                className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
                Save Settings
            </button>

            {status && (
                <div className={`text-sm text-center p-2 rounded ${status.includes('Error') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {status}
                </div>
            )}

            <div className="mt-auto border-t pt-4 text-xs text-gray-400 text-center">
                GAS4U v1.0.0
            </div>
        </div>
    );
};
