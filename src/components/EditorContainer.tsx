import Editor from "@monaco-editor/react";
import type React from "react";

type EditorContainerProps = {
  code: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: string;
};

export function EditorContainer({
  code,
  onChange,
  language = "javascript",
  theme = "light",
}: EditorContainerProps): React.ReactElement {
  const handleChange = (value: string | undefined): void => {
    onChange(value ?? "");
  };

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        value={code}
        onChange={handleChange}
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
}
