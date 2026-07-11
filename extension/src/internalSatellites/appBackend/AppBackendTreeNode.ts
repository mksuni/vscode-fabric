// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as vscode from 'vscode';
import { IArtifact, ArtifactTreeNode } from '@microsoft/vscode-fabric-api';

export class AppBackendTreeNode extends ArtifactTreeNode {
    constructor(context: vscode.ExtensionContext, public readonly artifact: IArtifact) {
        super(context, artifact);

        // Override the default readArtifact command to open the Getting Started webview
        this.command = {
            command: 'vscode-fabric.appBackend.openGettingStarted',
            title: 'Open Getting Started',
            arguments: [this],
        };
    }
}
