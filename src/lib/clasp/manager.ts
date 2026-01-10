import { GASClient } from './api';


export class ClaspManager {
    /**
     * Loads the main script file from a GAS project.
     * For simplicity, this currently looks for the first SERVER_JS file.
     */
    static async loadProject(scriptId: string): Promise<{ code: string; name: string } | null> {
        try {
            const files = await GASClient.getContent(scriptId);
            if (files.length === 0) {
                throw new Error('No files found in project');
            }

            // Priority: SERVER_JS -> HTML -> JSON
            const targetFile = files.find(f => f.type === 'SERVER_JS') || files[0];

            return {
                code: targetFile.source,
                name: targetFile.name,
            };
        } catch (error) {
            console.error('ClaspManager load error:', error);
            throw error;
        }
    }

    /**
     * Saves the code back to the project.
     * Fetches current files, updates the target one, and pushes all back to avoid deletion.
     */
    static async saveProject(scriptId: string, code: string, fileName: string = 'Code'): Promise<void> {
        try {
            // First, get current files to avoid deleting others
            // Note: In a real simultaneous editing scenario, we need better conflict resolution.
            const currentFiles = await GASClient.getContent(scriptId);

            const fileIndex = currentFiles.findIndex(f => f.name === fileName && f.type === 'SERVER_JS');

            if (fileIndex >= 0) {
                currentFiles[fileIndex].source = code;
            } else {
                currentFiles.push({
                    name: fileName,
                    type: 'SERVER_JS',
                    source: code
                });
            }

            await GASClient.updateContent(scriptId, currentFiles);
        } catch (error) {
            console.error('ClaspManager save error:', error);
            throw error;
        }
    }
}
