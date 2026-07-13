// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as vscode from 'vscode';
import { ArtifactTreeNode } from '@microsoft/vscode-fabric-api';
import { IFabricEnvironmentProvider, TelemetryService } from '@microsoft/vscode-fabric-util';
import { AppBackendWebviewPanel } from './AppBackendWebviewPanel';

let commandDisposables: vscode.Disposable[] = [];

export function registerAppBackendCommands(
    context: vscode.ExtensionContext,
    fabricEnvironmentProvider: IFabricEnvironmentProvider,
    telemetryService: TelemetryService
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
        if (treeNode?.artifact) {
            telemetryService.sendTelemetryEvent('appBackend/getStarted', {
                itemType: treeNode.artifact.type,
                result: 'Succeeded',
            });
            AppBackendWebviewPanel.show(
                treeNode.artifact,
                fabricEnvironmentProvider,
                telemetryService
            );
        }
    });

    registerCommand('vscode-fabric.appBackend.createRayfinApp', async () => {
        telemetryService.sendTelemetryEvent('appBackend/createRayfinApp', {
            result: 'Succeeded',
        });
        const terminal = vscode.window.createTerminal({
            name: 'Create Rayfin App',
        });
        terminal.show();
        terminal.sendText('npm create @microsoft/rayfin@latest');
    });
}

export function disposeCommands(): void {
    commandDisposables.forEach(d => d.dispose());
    commandDisposables = [];
}
