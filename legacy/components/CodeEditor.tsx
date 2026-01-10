import React from 'react';
import Editor, { OnMount } from '@monaco-editor/react';

interface CodeEditorProps {
    value: string;
    language?: string;
    onChange?: (value: string | undefined) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
    value,
    language = 'javascript',
    onChange
}) => {
    const handleEditorDidMount: OnMount = () => {
        // Editor mounted - logic can be added here later
    };

    return (
        <div className="h-full w-full">
            <Editor
                height="100%"
                defaultLanguage={language}
                defaultValue={value}
                value={value}
                onChange={onChange}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    automaticLayout: true,
                }}
            />
        </div>
    );
};
