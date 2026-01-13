// eslint-disable-next-line react-refresh/only-export-components
// Mock DiffEditor
export const DiffEditor = ({ original, modified }: { original: string; modified: string }) => (
  <div data-testid="mock-diff-editor">
    <div data-testid="original-value">{original}</div>
    <div data-testid="modified-value">{modified}</div>
  </div>
);

// Mock Editor
export const Editor = ({
  value,
  defaultValue,
  language,
  theme,
}: {
  value?: string;
  defaultValue?: string;
  language?: string;
  theme?: string;
}) => (
  <div data-testid="mock-monaco-editor">
    <div data-testid="editor-value">{value ?? defaultValue ?? ""}</div>
    <div data-testid="editor-language">{language ?? "javascript"}</div>
    <div data-testid="editor-theme">{theme ?? "light"}</div>
  </div>
);

// eslint-disable-next-line react-refresh/only-export-components
export const useMonaco = () => null;
// eslint-disable-next-line react-refresh/only-export-components
export const loader = { config: () => {} };

// Default export for Editor (used by EditorContainer)
export default Editor;
