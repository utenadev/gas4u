import { DiffEditor } from "@monaco-editor/react";
import type React from "react";

type DiffViewerProps = {
  original: string;
  modified: string;
  language?: string;
};

export function DiffViewer({
  original,
  modified,
  language = "javascript",
}: DiffViewerProps): React.ReactElement {
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
}
