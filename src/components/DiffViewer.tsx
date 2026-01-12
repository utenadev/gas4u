import { DiffEditor } from "@monaco-editor/react";
import type { FC } from "react";

interface DiffViewerProps {
  original: string;
  modified: string;
  language?: string;
}

export const DiffViewer: FC<DiffViewerProps> = ({
  original,
  modified,
  language = "javascript",
}) => {
  return (
    <div className="h-full w-full">
      <DiffEditor
        height="100%"
        language={language}
        original={original}
        modified={modified}
        theme="light"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
          renderSideBySide: false,
          readOnly: true,
        }}
      />
    </div>
  );
};
