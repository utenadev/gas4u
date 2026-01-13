import { useState } from "react";
import { ClaspManager } from "../lib/clasp/manager";
import { StorageManager } from "../lib/storage/manager";

type ProjectOperationsState = {
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

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function useProjectOperations(): [ProjectOperationsState, ProjectOperationsActions] {
  const [state, setState] = useState<ProjectOperationsState>({
    isLoadingProject: false,
    error: null,
  });

  const actions: ProjectOperationsActions = {
    async loadProject(scriptId, onProjectLoaded) {
      if (!scriptId) {
        return;
      }

      setState((prev) => ({ ...prev, isLoadingProject: true, error: null }));

      try {
        const project = await ClaspManager.loadProject(scriptId);
        if (project) {
          await StorageManager.saveSettings({ lastProjectId: scriptId });
          onProjectLoaded?.(project);
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: `Failed to load project: ${getErrorMessage(error)}`,
        }));
      } finally {
        setState((prev) => ({ ...prev, isLoadingProject: false }));
      }
    },

    async saveProject(scriptId, code, fileName) {
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
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: `Failed to save project: ${getErrorMessage(error)}`,
        }));
      } finally {
        setState((prev) => ({ ...prev, isLoadingProject: false }));
      }
    },

    setError(error) {
      setState((prev) => ({ ...prev, error }));
    },
  };

  return [state, actions];
}
