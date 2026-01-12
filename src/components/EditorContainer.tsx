import Editor from "@monaco-editor/react";
import type React from "react";

type EditorContainerProps = {
  code: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: string;
};

export const EditorContainer: React.FC<EditorContainerProps> = ({
  code,
  onChange,
  language = "javascript",
  theme = "light",
}) => {
  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        value={code}
        onChange={(value) => onChange(value || "")}
        theme={theme}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};
