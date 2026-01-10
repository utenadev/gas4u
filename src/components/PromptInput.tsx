import React, { useState } from 'react';

interface PromptInputProps {
    onSubmit: (prompt: string) => void;
    isLoading?: boolean;
    placeholder?: string;
}

export const PromptInput: React.FC<PromptInputProps> = ({
    onSubmit,
    isLoading = false,
    placeholder = "Describe what you want to do..."
}) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !isLoading) {
            onSubmit(prompt);
            setPrompt('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex gap-2 p-2 bg-white border-t">
            <input
                type="text"
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder={placeholder}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${isLoading || !prompt.trim()
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
            >
                {isLoading ? 'Generating...' : 'Send'}
            </button>
        </form>
    );
};
