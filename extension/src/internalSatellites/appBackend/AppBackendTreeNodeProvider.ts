// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ExtensionContext } from 'vscode';
import { IFabricTreeNodeProvider, ArtifactTreeNode, IArtifact } from '@microsoft/vscode-fabric-api';
import { AppBackendTreeNode } from './AppBackendTreeNode';

export class AppBackendTreeNodeProvider implements IFabricTreeNodeProvider {
    public readonly artifactType = 'AppBackend';

    constructor(private context: ExtensionContext) {
    }

    async createArtifactTreeNode(artifact: IArtifact): Promise<ArtifactTreeNode> {
        return new AppBackendTreeNode(this.context, artifact);
    }
}
