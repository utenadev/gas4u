import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { DiffViewer } from "../components/DiffViewer";
import { EditorContainer } from "../components/EditorContainer";
import { ProjectHeader } from "../components/ProjectHeader";
import { PromptInput } from "../components/PromptInput";
import { useEditorState } from "../hooks/useEditorState";
import { useGeminiIntegration } from "../hooks/useGeminiIntegration";
import { useProjectOperations } from "../hooks/useProjectOperations";
import "../index.css";

export const EditorApp = () => {
  const [scriptId, setScriptId] = React.useState("");
  const [currentFileName, setCurrentFileName] = React.useState("Code");

  const [editorState, editorActions] = useEditorState(
    "function myFunction() {\n  // your code here\n}\n"
  );
  const [projectState, projectActions] = useProjectOperations();
  const [geminiState, geminiActions] = useGeminiIntegration();

  const { originalCode, modifiedCode, isGenerating, error: editorError } = editorState;
  const { isLoadingProject, error: projectError } = projectState;
  const { client, error: geminiError } = geminiState;

  const combinedError = editorError || projectError || geminiError;

  useEffect(() => {
    geminiActions.initializeClient();
    const loadLastId = async () => {
      const lastId = (await chrome.storage.sync.get(["lastProjectId"])).lastProjectId;
      if (lastId) {
        setScriptId(lastId);
      }
    };
    loadLastId();
  }, [geminiActions]);

  const handleLoadProject = async () => {
    await projectActions.loadProject(scriptId, (project) => {
      editorActions.setOriginalCode(project.code);
      setCurrentFileName(project.name);
    });
  };

  const handleSaveProject = async () => {
    await projectActions.saveProject(scriptId, originalCode, currentFileName);
  };

  const handlePromptSubmit = async (prompt: string) => {
    const result = await geminiActions.generateCode(prompt, originalCode);

    if (result.error) {
      editorActions.setError(result.error);
    } else {
      editorActions.setModifiedCode(result.code || "");
    }
  };

  const handleAccept = () => {
    editorActions.setOriginalCode(modifiedCode);
    editorActions.setModifiedCode("");
  };

  const handleReject = () => {
    editorActions.setModifiedCode("");
  };

  if (!client) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 text-slate-500">
        Please set your API Key in the popup.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <ProjectHeader
        scriptId={scriptId}
        setScriptId={setScriptId}
        onLoadProject={handleLoadProject}
        onSaveProject={handleSaveProject}
        isLoadingProject={isLoadingProject}
        currentFileName={currentFileName}
      />

      <main className="flex-1 overflow-hidden relative">
        {modifiedCode ? (
          <DiffViewer original={originalCode} modified={modifiedCode} />
        ) : (
          <EditorContainer
            code={originalCode}
            onChange={(value) => editorActions.setOriginalCode(value)}
          />
        )}

        {modifiedCode && (
          <div className="absolute top-4 right-4 z-50 flex gap-2 animate-fade-in">
            <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-1.5 flex gap-2">
              <button
                onClick={handleReject}
                className="px-3 py-1.5 rounded-md hover:bg-red-50 text-red-600 text-xs font-medium transition-colors flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Reject
              </button>
              <button
                onClick={handleAccept}
                className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition-colors flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Accept Changes
              </button>
            </div>
          </div>
        )}
        {combinedError && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 min-w-[300px] p-4 bg-white border-l-4 border-red-500 rounded-r shadow-xl z-50 animate-slide-up flex justify-between items-start gap-3">
            <div className="flex-1">
              <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">
                Error
              </h4>
              <p className="text-sm text-slate-600">{combinedError}</p>
            </div>
            <button
              onClick={() => projectActions.setError(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </main>

      <footer className="z-10">
        <PromptInput
          onSubmit={handlePromptSubmit}
          isLoading={isGenerating}
          placeholder="Describe functionality to add or change..."
        />
      </footer>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <EditorApp />
  </React.StrictMode>
);
