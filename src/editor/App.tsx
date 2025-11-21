import React, { useState } from 'react';
import { CodeEditor } from '../components/CodeEditor';

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
                <div className="h-10 border-b border-gray-200 flex items-center px-4 bg-white">
                    <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                        Save
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
        </div>
    );
};

export default App;
