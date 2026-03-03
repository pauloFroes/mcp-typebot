import { z } from "zod";
import { apiRequest, toolResult, toolError } from "../client.js";
export function registerFolderTools(server) {
    server.registerTool("list_folders", {
        title: "List Folders",
        description: "List folders in a workspace. Optionally filter by parent folder to navigate the folder tree.",
        inputSchema: {
            workspace_id: z.string().describe("Workspace ID"),
            parent_folder_id: z
                .string()
                .optional()
                .describe("Parent folder ID to list subfolders (omit for root folders)"),
        },
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            openWorldHint: true,
        },
    }, async ({ workspace_id, parent_folder_id }) => {
        try {
            const data = await apiRequest("/v1/folders", "GET", undefined, {
                workspaceId: workspace_id,
                parentFolderId: parent_folder_id,
            });
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to list folders: ${error.message}`);
        }
    });
    server.registerTool("get_folder", {
        title: "Get Folder",
        description: "Get details of a specific folder.",
        inputSchema: {
            folder_id: z.string().describe("Folder ID"),
            workspace_id: z.string().describe("Workspace ID"),
        },
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            openWorldHint: true,
        },
    }, async ({ folder_id, workspace_id }) => {
        try {
            const data = await apiRequest(`/v1/folders/${folder_id}`, "GET", undefined, {
                workspaceId: workspace_id,
            });
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to get folder: ${error.message}`);
        }
    });
    server.registerTool("create_folder", {
        title: "Create Folder",
        description: "Create a new folder in a workspace.",
        inputSchema: {
            workspace_id: z.string().describe("Workspace ID"),
            folder_name: z.string().optional().describe("Folder name (default: empty string)"),
            parent_folder_id: z.string().optional().describe("Parent folder ID for nesting"),
        },
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            openWorldHint: true,
        },
    }, async ({ workspace_id, folder_name, parent_folder_id }) => {
        try {
            const body = { workspaceId: workspace_id };
            if (folder_name)
                body.folderName = folder_name;
            if (parent_folder_id)
                body.parentFolderId = parent_folder_id;
            const data = await apiRequest("/v1/folders", "POST", body);
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to create folder: ${error.message}`);
        }
    });
    server.registerTool("update_folder", {
        title: "Update Folder",
        description: "Update a folder name or move it to a different parent folder.",
        inputSchema: {
            folder_id: z.string().describe("Folder ID to update"),
            workspace_id: z.string().describe("Workspace ID"),
            name: z.string().optional().describe("New folder name"),
            parent_folder_id: z
                .string()
                .optional()
                .describe("New parent folder ID (null for root)"),
        },
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            openWorldHint: true,
        },
    }, async ({ folder_id, workspace_id, name, parent_folder_id }) => {
        try {
            const folder = {};
            if (name !== undefined)
                folder.name = name;
            if (parent_folder_id !== undefined)
                folder.parentFolderId = parent_folder_id;
            const data = await apiRequest(`/v1/folders/${folder_id}`, "PATCH", {
                workspaceId: workspace_id,
                folder,
            });
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to update folder: ${error.message}`);
        }
    });
    server.registerTool("delete_folder", {
        title: "Delete Folder",
        description: "Delete a folder and its contents. This action cannot be undone.",
        inputSchema: {
            folder_id: z.string().describe("Folder ID to delete"),
            workspace_id: z.string().describe("Workspace ID"),
        },
        annotations: {
            readOnlyHint: false,
            destructiveHint: true,
            openWorldHint: true,
        },
    }, async ({ folder_id, workspace_id }) => {
        try {
            const data = await apiRequest(`/v1/folders/${folder_id}`, "DELETE", undefined, {
                workspaceId: workspace_id,
            });
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to delete folder: ${error.message}`);
        }
    });
}
