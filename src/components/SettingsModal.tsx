import React, { useEffect, useState } from 'react';
import { storage, StorageKey } from '../lib/storage';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const [apiKey, setApiKey] = useState('');
    const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    useEffect(() => {
        if (isOpen) {
            loadSettings();
        }
    }, [isOpen]);

    const loadSettings = async () => {
        const key = await storage.get<string>(StorageKey.GEMINI_API_KEY);
        if (key) setApiKey(key);
    };

    const handleSave = async () => {
        setStatus('saving');
        await storage.set(StorageKey.GEMINI_API_KEY, apiKey);
        setStatus('saved');
        setTimeout(() => {
            setStatus('idle');
            onClose();
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-full shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">設定</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gemini API Key
                    </label>
                    <input
                        type="password"
                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Enter your API key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Google AI Studio で取得したキーを入力してください。
                    </p>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        onClick={onClose}
                    >
                        キャンセル
                    </button>
                    <button
                        className={`px-4 py-2 rounded text-white transition-colors ${status === 'saved' ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        onClick={handleSave}
                        disabled={status === 'saving'}
                    >
                        {status === 'saving' ? '保存中...' : status === 'saved' ? '保存しました' : '保存'}
                    </button>
                </div>
            </div>
        </div>
    );
};
