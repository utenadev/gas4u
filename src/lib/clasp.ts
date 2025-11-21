export interface ClaspManifest {
    timeZone: string;
    dependencies: {
        libraries: Array<{
            userSymbol: string;
            libraryId: string;
            version: string;
            developmentMode?: boolean;
        }>;
        enabledAdvancedServices: Array<{
            userSymbol: string;
            serviceId: string;
            version: string;
        }>;
    };
    exceptionLogging: 'STACKDRIVER' | 'NONE';
    runtimeVersion: 'V8' | 'DEPRECATED_ES5';
    webapp?: {
        access: 'MYSELF' | 'DOMAIN' | 'ANYONE' | 'ANYONE_ANONYMOUS';
        executeAs: 'USER_ACCESSING' | 'USER_DEPLOYING';
    };
    executionApi?: {
        access: 'MYSELF' | 'DOMAIN' | 'ANYONE' | 'ANYONE_ANONYMOUS';
    };
}

export const DEFAULT_MANIFEST: ClaspManifest = {
    timeZone: 'Asia/Tokyo',
    dependencies: {
        libraries: [],
        enabledAdvancedServices: []
    },
    exceptionLogging: 'STACKDRIVER',
    runtimeVersion: 'V8'
};

/**
 * Converts a local file extension to a Google Apps Script extension.
 * .js/.ts -> .gs
 * .html -> .html
 */
export function getGasExtension(fileName: string): string {
    const parts = fileName.split('.');
    const ext = parts.pop();
    const name = parts.join('.');

    if (ext === 'js' || ext === 'ts') {
        return `${name}.gs`;
    }
    if (ext === 'html') {
        return fileName;
    }
    return fileName;
}

/**
 * Converts a Google Apps Script file extension to a local file extension.
 * .gs -> .js (default)
 */
export function getLocalExtension(fileName: string): string {
    const parts = fileName.split('.');
    const ext = parts.pop();
    const name = parts.join('.');

    if (ext === 'gs') {
        return `${name}.js`;
    }
    return fileName;
}
