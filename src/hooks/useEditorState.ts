import { useState } from "react";

type EditorState = {
  originalCode: string;
  modifiedCode: string;
  isGenerating: boolean;
  error: string | null;
};

type EditorStateActions = {
  setOriginalCode: (code: string) => void;
  setModifiedCode: (code: string) => void;
  setIsGenerating: (generating: boolean) => void;
  setError: (error: string | null) => void;
};

export function useEditorState(initialCode: string): [EditorState, EditorStateActions] {
  const [state, setState] = useState<EditorState>({
    originalCode: initialCode,
    modifiedCode: "",
    isGenerating: false,
    error: null,
  });

  const actions: EditorStateActions = {
    setOriginalCode: (code) => {
      setState((prev) => ({ ...prev, originalCode: code }));
    },
    setModifiedCode: (code) => {
      setState((prev) => ({ ...prev, modifiedCode: code }));
    },
    setIsGenerating: (generating) => {
      setState((prev) => ({ ...prev, isGenerating: generating }));
    },
    setError: (error) => {
      setState((prev) => ({ ...prev, error }));
    },
  };

  return [state, actions];
}
