export interface GASFile {
  name: string;
  type: "SERVER_JS" | "HTML" | "JSON";
  source: string;
}

export interface GASProject {
  scriptId: string;
  title: string;
  files: GASFile[];
}

// Chrome Extension API types for GAS client
export interface ChromeIdentity {
  getAuthToken: (options: { interactive: boolean }, callback: (token?: string) => void) => void;
  removeCachedAuthToken: (details: { token: string }, callback?: () => void) => void;
}

export interface Chrome {
  identity: ChromeIdentity;
  runtime: { lastError: chrome.runtime.LastError | null };
}
