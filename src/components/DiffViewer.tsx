import React from 'react';
import { DiffEditor } from '@monaco-editor/react';

interface DiffViewerProps {
    original: string;
    modified: string;
    language?: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
    original,
    modified,
    language = 'javascript',
}) => {
    return (
        <div className="h-full w-full">
            <DiffEditor
                height="100%"
                language={language}
                original={original}
                modified={modified}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    automaticLayout: true,
                    renderSideBySide: false,
                    readOnly: true, // Usually diffs are read-only
                    theme: 'vs-light', // Or dynamic based on setting
                }}
            />
        </div>
    );
};
