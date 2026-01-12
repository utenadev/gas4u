import { useState } from "react";
import { ClaspManager } from "../lib/clasp/manager";
import { StorageManager } from "../lib/storage/manager";

type ProjectOperations = {
  isLoadingProject: boolean;
  error: string | null;
};

type ProjectOperationsActions = {
  loadProject: (
    scriptId: string,
    onProjectLoaded?: (project: { code: string; name: string }) => void
  ) => Promise<void>;
  saveProject: (scriptId: string, code: string, fileName: string) => Promise<void>;
  setError: (error: string | null) => void;
};

export const useProjectOperations = (): [ProjectOperations, ProjectOperationsActions] => {
  const [state, setState] = useState<ProjectOperations>({
    isLoadingProject: false,
    error: null,
  });

  const actions: ProjectOperationsActions = {
    loadProject: async (
      scriptId: string,
      onProjectLoaded?: (project: { code: string; name: string }) => void
    ) => {
      if (!scriptId) return;
      setState((prev) => ({ ...prev, isLoadingProject: true, error: null }));
      try {
        const project = await ClaspManager.loadProject(scriptId);
        if (project) {
          await StorageManager.saveSettings({ lastProjectId: scriptId });
          if (onProjectLoaded) {
            onProjectLoaded(project);
          }
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        setState((prev) => ({
          ...prev,
          error: "Failed to load project: " + message,
        }));
      } finally {
        setState((prev) => ({ ...prev, isLoadingProject: false }));
      }
    },
    saveProject: async (scriptId: string, code: string, fileName: string) => {
      if (!scriptId) {
        setState((prev) => ({
          ...prev,
          error: "Please enter a Script ID first.",
        }));
        return;
      }
      setState((prev) => ({ ...prev, isLoadingProject: true, error: null }));
      try {
        await ClaspManager.saveProject(scriptId, code, fileName);
        alert("Successfully saved to GAS project!");
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        setState((prev) => ({
          ...prev,
          error: "Failed to save project: " + message,
        }));
      } finally {
        setState((prev) => ({ ...prev, isLoadingProject: false }));
      }
    },
    setError: (error: string | null) => setState((prev) => ({ ...prev, error })),
  };

  return [state, actions];
};
