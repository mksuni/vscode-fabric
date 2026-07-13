// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as vscode from 'vscode';
import { ArtifactTreeNode } from '@microsoft/vscode-fabric-api';
import { IFabricEnvironmentProvider, TelemetryService } from '@microsoft/vscode-fabric-util';
import { AppBackendWebviewPanel } from './AppBackendWebviewPanel';

let commandDisposables: vscode.Disposable[] = [];

/**
 * Registers App Backend commands early (before full activation completes).
 * The `createRayfinApp` command works immediately; `getStarted` uses
 * a late-bound provider/telemetry that gets set once satellites activate.
 */
export function registerAppBackendCommands(
    context: vscode.ExtensionContext,
): void {
    function registerCommand(
        commandName: string,
        callback: (...args: any[]) => Promise<void>,
    ): void {
        const disposable = vscode.commands.registerCommand(commandName, callback);
        context.subscriptions.push(disposable);
        commandDisposables.push(disposable);
    }

    registerCommand('vscode-fabric.appBackend.getStarted', async (...cmdArgs) => {
        const treeNode = cmdArgs[0] as ArtifactTreeNode | undefined;
        if (treeNode?.artifact && _fabricEnvironmentProvider) {
            _telemetryService?.sendTelemetryEvent('appBackend/getStarted', {
                itemType: treeNode.artifact.type,
                result: 'Succeeded',
            });
            AppBackendWebviewPanel.show(
                treeNode.artifact,
                _fabricEnvironmentProvider,
                _telemetryService
            );
        }
    });

    registerCommand('vscode-fabric.appBackend.createRayfinApp', async () => {
        _telemetryService?.sendTelemetryEvent('appBackend/createRayfinApp', {
            result: 'Succeeded',
        });
        const terminal = vscode.window.createTerminal({
            name: 'Create Rayfin App',
        });
        terminal.show();
        terminal.sendText('npm create @microsoft/rayfin@latest');
    });
}

let _fabricEnvironmentProvider: IFabricEnvironmentProvider | undefined;
let _telemetryService: TelemetryService | undefined;

/**
 * Binds the late-resolved services so that commands can use them.
 * Called from AppBackendExtension after satellite activation.
 */
export function bindAppBackendServices(
    fabricEnvironmentProvider: IFabricEnvironmentProvider,
    telemetryService: TelemetryService
): void {
    _fabricEnvironmentProvider = fabricEnvironmentProvider;
    _telemetryService = telemetryService;
}

export function disposeCommands(): void {
    commandDisposables.forEach(d => d.dispose());
    commandDisposables = [];
    _fabricEnvironmentProvider = undefined;
    _telemetryService = undefined;
}
