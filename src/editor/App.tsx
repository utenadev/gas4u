
import Editor from '@monaco-editor/react';

function App() {
    return (
        <div className="h-screen w-screen flex flex-col bg-gray-900 text-white">
            <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h1 className="text-lg font-bold">GAS4U Editor</h1>
                <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500">Save</button>
            </header>
            <main className="flex-1">
                <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    defaultValue="// Start coding GAS..."
                    theme="vs-dark"
                />
            </main>
        </div>
    );
}

export default App;
