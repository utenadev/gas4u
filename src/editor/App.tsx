import React, { useState } from 'react';
import { CodeEditor } from '../components/CodeEditor';
import { GeminiClient } from '../lib/gemini';
import { storage, StorageKey } from '../lib/storage';

interface FileNode {
    id: string;
    name: string;
    type: 'file' | 'folder';
    content?: string;
    children?: FileNode[];
}

const MOCK_FILES: FileNode[] = [
    {
        id: '1',
        name: 'Code.gs',
        type: 'file',
        content: `function myFunction() {
  Logger.log('Hello, world!');
}`
    },
    {
        id: '2',
        name: 'utils.gs',
        type: 'file',
        content: `function formatDate(date) {
  return Utilities.formatDate(date, 'JST', 'yyyy/MM/dd');
}`
    },
    {
        id: '3',
        name: 'appsscript.json',
        type: 'file',
        content: `{
  "timeZone": "Asia/Tokyo",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8"
}`
    }
];

const App: React.FC = () => {
    const [files, setFiles] = useState<FileNode[]>(MOCK_FILES);
    const [selectedFileId, setSelectedFileId] = useState<string | null>('1');
    const [fileContent, setFileContent] = useState<string>(MOCK_FILES[0].content || '');
    const [showAiPrompt, setShowAiPrompt] = useState<boolean>(false);
    const [aiPrompt, setAiPrompt] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    const handleFileClick = (file: FileNode) => {
        if (file.type === 'file') {
            setSelectedFileId(file.id);
            setFileContent(file.content || '');
        }
    };

    const handleEditorChange = (value: string | undefined) => {
        if (selectedFileId && value !== undefined) {
            setFiles(prevFiles => prevFiles.map(f =>
                f.id === selectedFileId ? { ...f, content: value } : f
            ));
            setFileContent(value);
        }
    };

    const handleAiGenerate = async () => {
        if (!aiPrompt.trim()) return;

        setIsGenerating(true);
        try {
            const apiKey = await storage.get<string>(StorageKey.GEMINI_API_KEY);
            if (!apiKey) {
                alert('Gemini API Key が設定されていません。設定画面で登録してください。');
                return;
            }

            const client = new GeminiClient(apiKey);
            const generatedCode = await client.generateCode(aiPrompt);

            // Insert generated code at cursor position or replace selection
            setFileContent(prev => prev + '\n\n' + generatedCode);
            setShowAiPrompt(false);
            setAiPrompt('');
        } catch (error) {
            console.error('AI generation failed:', error);
            alert('コード生成に失敗しました。APIキーを確認してください。');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex h-screen w-screen bg-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-sm font-bold text-gray-700">Files</h2>
                </div>
                <div className="flex-grow overflow-y-auto p-2">
                    {files.map(file => (
                        <div
                            key={file.id}
                            className={`p-2 text-sm cursor-pointer rounded flex items-center ${selectedFileId === file.id ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            onClick={() => handleFileClick(file)}
                        >
                            <span className="mr-2">{file.type === 'folder' ? '📁' : '📄'}</span>
                            {file.name}
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Editor Area */}
            <main className="flex-grow flex flex-col">
                {/* Toolbar (Mock) */}
                <div className="h-10 border-b border-gray-200 flex items-center px-4 bg-white gap-2">
                    <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                        Save
                    </button>
                    <button
                        className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                        onClick={() => setShowAiPrompt(true)}
                    >
                        ✨ AI Generate
                    </button>
                </div>

                {/* Editor */}
                <div className="flex-grow relative">
                    <CodeEditor
                        value={fileContent}
                        onChange={handleEditorChange}
                        language={selectedFileId === '3' ? 'json' : 'javascript'}
                    />
                </div>
            </main>

            {/* AI Prompt Modal */}
            {showAiPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-full">
                        <h3 className="text-lg font-bold mb-4">AI コード生成</h3>
                        <textarea
                            className="w-full border border-gray-300 rounded p-2 mb-4 h-32"
                            placeholder="例: SpreadSheetのA列の値を全て取得する関数を作成"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() => {
                                    setShowAiPrompt(false);
                                    setAiPrompt('');
                                }}
                                disabled={isGenerating}
                            >
                                キャンセル
                            </button>
                            <button
                                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                                onClick={handleAiGenerate}
                                disabled={isGenerating}
                            >
                                {isGenerating ? '生成中...' : '生成'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
