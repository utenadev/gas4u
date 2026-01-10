import React, { useState, useEffect } from 'react';
import { CodeEditor } from '../components/CodeEditor';
import { DiffViewer } from '../components/DiffViewer';
import { GeminiClient } from '../lib/gemini';
import { storage, StorageKey } from '../lib/storage';
import { SettingsModal } from '../components/SettingsModal';


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
    const [files, setFiles] = useState<FileNode[]>([]);
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
    const [fileContent, setFileContent] = useState<string>('');
    const [showAiPrompt, setShowAiPrompt] = useState<boolean>(false);
    const [aiPrompt, setAiPrompt] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [diffMode, setDiffMode] = useState<boolean>(false);
    const [modifiedContent, setModifiedContent] = useState<string>('');

    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [projectId, setProjectId] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const pid = params.get('projectId');
        setProjectId(pid);

        if (pid) {
            loadProjectContent(pid);
        } else {
            // Fallback to mock if no projectId (e.g. direct dev server access)
            setFiles(MOCK_FILES);
            setSelectedFileId('1');
            setFileContent(MOCK_FILES[0].content || '');
            setIsLoading(false);
        }
    }, []);

    const loadProjectContent = async (id: string) => {
        setIsLoading(true);
        try {
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                const response = await chrome.runtime.sendMessage({
                    type: 'GET_PROJECT_CONTENT',
                    scriptId: id
                });

                if (response.error) {
                    alert(`Failed to load project: ${response.error}`);
                    return;
                }

                if (response.files) {
                    const nodes: FileNode[] = response.files.map((f: any, index: number) => {
                        const fileName = f.name;
                        let nameWithExt = fileName;
                        if (f.type === 'SERVER_JS' && !fileName.endsWith('.gs')) {
                            nameWithExt = `${fileName}.gs`;
                        } else if (f.type === 'HTML' && !fileName.endsWith('.html')) {
                            nameWithExt = `${fileName}.html`;
                        } else if (f.type === 'JSON' && !fileName.endsWith('.json')) {
                            nameWithExt = `${fileName}.json`;
                        }

                        return {
                            id: String(index),
                            name: nameWithExt,
                            type: 'file',
                            content: f.source
                        };
                    });

                    setFiles(nodes);
                    if (nodes.length > 0) {
                        setSelectedFileId(nodes[0].id);
                        setFileContent(nodes[0].content || '');
                    }
                }
            } else {
                console.warn('Chrome runtime not available');
                setFiles(MOCK_FILES);
            }
        } catch (error) {
            console.error('Error loading project:', error);
            alert('Error loading project');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveProject = async () => {
        if (!projectId) return;

        try {
            const gasFiles = files.map(f => {
                const name = f.name.replace(/\.(gs|html|json)$/, '');
                let type = 'SERVER_JS';
                if (f.name.endsWith('.html')) type = 'HTML';
                if (f.name.endsWith('.json')) type = 'JSON';

                return {
                    name,
                    type,
                    source: f.content
                };
            });

            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                const response = await chrome.runtime.sendMessage({
                    type: 'UPDATE_PROJECT_CONTENT',
                    scriptId: projectId,
                    files: gasFiles
                });

                if (response.error) {
                    alert(`Save failed: ${response.error}`);
                } else {
                    alert('Saved successfully!');
                }
            }
        } catch (error) {
            console.error('Save failed:', error);
            alert('Save failed');
        }
    };

    const handleFileClick = (file: FileNode) => {
        if (file.type === 'file') {
            if (diffMode) {
                if (!window.confirm('差分表示モードを終了してファイルを切り替えますか？変更は破棄されます。')) {
                    return;
                }
                setDiffMode(false);
                setModifiedContent('');
            }
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
                setShowSettings(true); // Open settings if key is missing
                return;
            }

            let generatedCode = '';
            if (import.meta.env.DEV && apiKey === 'TEST_KEY') {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
                // Mock modification: add a comment to the existing code
                generatedCode = `// Generated by AI (Mock)\n// Modified based on request: ${aiPrompt}\n` + fileContent;
            } else {
                const client = new GeminiClient(apiKey);
                // Pass current file content as context
                generatedCode = await client.generateCode(aiPrompt, fileContent);
            }

            // Prepare modified content for Diff View
            // Now generatedCode is the COMPLETE new content, so we use it directly
            const newContent = generatedCode;
            setModifiedContent(newContent);
            setDiffMode(true);

            setShowAiPrompt(false);
            setAiPrompt('');
        } catch (error) {
            console.error('AI generation failed:', error);
            alert('コード生成に失敗しました。APIキーを確認してください。');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAcceptDiff = () => {
        setFileContent(modifiedContent);
        if (selectedFileId) {
            setFiles(prevFiles => prevFiles.map(f =>
                f.id === selectedFileId ? { ...f, content: modifiedContent } : f
            ));
        }
        setDiffMode(false);
        setModifiedContent('');
    };

    const handleRejectDiff = () => {
        setDiffMode(false);
        setModifiedContent('');
    };

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-white">
                <div className="text-gray-500">Loading project...</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-screen bg-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-sm font-bold text-gray-700">Files</h2>
                    <button
                        className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200"
                        onClick={() => setShowSettings(true)}
                        title="Settings"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l-.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
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
                {/* Toolbar */}
                <div className="h-10 border-b border-gray-200 flex items-center px-4 bg-white gap-2 justify-between">
                    <div className="flex gap-2">
                        {!diffMode ? (
                            <>
                                <button
                                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                                    onClick={handleSaveProject}
                                    disabled={!projectId}
                                >
                                    Save
                                </button>
                                <button
                                    className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                                    onClick={() => setShowAiPrompt(true)}
                                >
                                    ✨ AI Generate
                                </button>
                            </>
                        ) : (
                            <span className="text-sm font-bold text-gray-700">差分確認モード</span>
                        )}
                    </div>

                    {diffMode && (
                        <div className="flex gap-2">
                            <button
                                className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                                onClick={handleRejectDiff}
                            >
                                破棄 (Reject)
                            </button>
                            <button
                                className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                onClick={handleAcceptDiff}
                            >
                                適用 (Accept)
                            </button>
                        </div>
                    )}
                </div>

                {/* Editor or Diff Viewer */}
                <div className="flex-grow relative">
                    {diffMode ? (
                        <DiffViewer
                            original={fileContent}
                            modified={modifiedContent}
                            language={selectedFileId === '3' ? 'json' : 'javascript'}
                        />
                    ) : (
                        <CodeEditor
                            value={fileContent}
                            onChange={handleEditorChange}
                            language={selectedFileId === '3' ? 'json' : 'javascript'}
                        />
                    )}
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

            {/* Settings Modal */}
            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
            />
        </div>
    );
};

export default App;
