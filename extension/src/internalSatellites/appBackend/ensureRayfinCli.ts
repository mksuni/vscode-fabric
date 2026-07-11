// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

declare const __IS_WEB__: boolean;

/**
 * Ensures the rayfin CLI (@microsoft/rayfin) is installed globally at its latest version.
 * Runs in the background and does not block extension activation.
 * Only runs in Node.js environments (not web extensions).
 */
export function ensureRayfinCliInstalled(): void {
    if (typeof __IS_WEB__ !== 'undefined' && __IS_WEB__) {
        return; // Not available in web extension host
    }

    try {
        // Dynamic import to avoid webpack bundling child_process for web
        const cp = require('child_process') as typeof import('child_process');
        const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

        const child = cp.spawn(npmCommand, ['install', '-g', '@microsoft/rayfin@latest'], {
            stdio: 'ignore',
            detached: true,
            shell: true,
        });

        // Detach so it doesn't block extension shutdown
        child.unref();
    }
    catch {
        // Silently ignore if spawn fails (e.g., npm not available)
    }
}
