// eslint-disable-next-line react-refresh/only-export-components
// Mock DiffEditor
export const DiffEditor = ({ original, modified }: { original: string; modified: string }) => (
  <div data-testid="mock-diff-editor">
    <div data-testid="original-value">{original}</div>
    <div data-testid="modified-value">{modified}</div>
  </div>
);

// Mock Editor
export const Editor = ({ value, defaultValue }: { value?: string; defaultValue?: string }) => (
  <textarea data-testid="mock-editor" value={value} defaultValue={defaultValue} readOnly />
);

// eslint-disable-next-line react-refresh/only-export-components
export const useMonaco = () => null;
// eslint-disable-next-line react-refresh/only-export-components
export const loader = { config: () => {} };

const MonacoEditor = {
  DiffEditor,
  Editor,
  useMonaco,
  loader,
};

export default MonacoEditor;
