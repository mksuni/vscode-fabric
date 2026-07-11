// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as vscode from 'vscode';
import { apiVersion, IFabricExtension, IFabricExtensionManager, IFabricTreeNodeProvider, ILocalProjectTreeNodeProvider } from '@microsoft/vscode-fabric-api';
import { IFabricEnvironmentProvider, ILogger, TelemetryService } from '@microsoft/vscode-fabric-util';
import { AppBackendTreeNodeProvider } from './AppBackendTreeNodeProvider';
import { registerAppBackendCommands, disposeCommands } from './commands';
import { ensureRayfinCliInstalled } from './ensureRayfinCli';

export class AppBackendExtension implements IFabricExtension, vscode.Disposable {
    public identity: string = 'fabric.internal-satellite-appbackend';
    public apiVersion: string = apiVersion;
    public artifactTypes: string[] = ['AppBackend'];
    public treeNodeProviders: IFabricTreeNodeProvider[] = [
        new AppBackendTreeNodeProvider(this.context),
    ];
    public localProjectTreeNodeProviders: ILocalProjectTreeNodeProvider[] = [];

    constructor(
        private context: vscode.ExtensionContext,
        private telemetryService: TelemetryService,
        private fabricEnvironmentProvider: IFabricEnvironmentProvider,
        extensionManager: IFabricExtensionManager
    ) {
        const serviceCollection = extensionManager.addExtension(this);

        registerAppBackendCommands(
            this.context,
            serviceCollection.workspaceManager,
            this.fabricEnvironmentProvider,
            this.telemetryService
        );

        // Install rayfin CLI in the background on activation
        ensureRayfinCliInstalled();
    }

    dispose() {
        disposeCommands();
    }
}
