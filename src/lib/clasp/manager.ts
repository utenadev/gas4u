import { GASClient } from "./api";
import type { GASFile } from "./types";

const DEFAULT_FILE_NAME = "Code";
const FILE_TYPE = "SERVER_JS" as const;

function findMainScriptFile(files: GASFile[]): GASFile {
  const serverJsFile = files.find((file) => file.type === FILE_TYPE);

  if (serverJsFile) {
    return serverJsFile;
  }

  return files[0];
}

function findOrCreateFile(files: GASFile[], fileName: string, code: string): GASFile[] {
  const fileIndex = files.findIndex(
    (file) => file.name === fileName && file.type === FILE_TYPE
  );

  if (fileIndex >= 0) {
    files[fileIndex].source = code;
    return files;
  }

  return [
    ...files,
    {
      name: fileName,
      type: FILE_TYPE,
      source: code,
    },
  ];
}

export class ClaspManager {
  static async loadProject(scriptId: string): Promise<{ code: string; name: string }> {
    const files = await GASClient.getContent(scriptId);

    if (files.length === 0) {
      throw new Error("No files found in project");
    }

    const targetFile = findMainScriptFile(files);

    return {
      code: targetFile.source,
      name: targetFile.name,
    };
  }

  static async saveProject(
    scriptId: string,
    code: string,
    fileName = DEFAULT_FILE_NAME
  ): Promise<void> {
    const currentFiles = await GASClient.getContent(scriptId);
    const updatedFiles = findOrCreateFile(currentFiles, fileName, code);

    await GASClient.updateContent(scriptId, updatedFiles);
  }
}
