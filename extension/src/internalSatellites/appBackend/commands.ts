// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as vscode from 'vscode';
import { ArtifactTreeNode, IWorkspaceManager } from '@microsoft/vscode-fabric-api';
import { IFabricEnvironmentProvider, TelemetryService } from '@microsoft/vscode-fabric-util';
import { AppBackendWebviewPanel } from './AppBackendWebviewPanel';

let commandDisposables: vscode.Disposable[] = [];

export function registerAppBackendCommands(
    context: vscode.ExtensionContext,
    workspaceManager: IWorkspaceManager,
    fabricEnvironmentProvider: IFabricEnvironmentProvider,
    telemetryService: TelemetryService
): void {
    const openGettingStarted = vscode.commands.registerCommand(
        'vscode-fabric.appBackend.openGettingStarted',
        async (...cmdArgs) => {
            const treeNode = cmdArgs[0] as ArtifactTreeNode | undefined;
            if (treeNode?.artifact) {
                AppBackendWebviewPanel.show(
                    treeNode.artifact,
                    workspaceManager,
                    fabricEnvironmentProvider
                );
            }
        }
    );

    context.subscriptions.push(openGettingStarted);
    commandDisposables.push(openGettingStarted);
}

export function disposeCommands(): void {
    commandDisposables.forEach(d => d.dispose());
    commandDisposables = [];
}
