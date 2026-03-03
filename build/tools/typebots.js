import { z } from "zod";
import { apiRequest, toolResult, toolError } from "../client.js";
export function registerTypebotTools(server) {
    server.registerTool("list_typebots", {
        title: "List Typebots",
        description: "List all typebots in a workspace. Optionally filter by folder. Returns id, name, icon, publishedTypebotId and accessRight for each bot.",
        inputSchema: {
            workspace_id: z.string().describe("Workspace ID to list typebots from"),
            folder_id: z.string().optional().describe("Filter by folder ID"),
        },
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            openWorldHint: true,
        },
    }, async ({ workspace_id, folder_id }) => {
        try {
            const data = await apiRequest("/v1/typebots", "GET", undefined, {
                workspaceId: workspace_id,
                folderId: folder_id,
            });
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to list typebots: ${error.message}`);
        }
    });
    server.registerTool("get_typebot", {
        title: "Get Typebot",
        description: "Get complete details of a typebot by its ID. Returns the full bot configuration including groups, edges, variables, theme, settings.",
        inputSchema: {
            typebot_id: z.string().describe("Typebot ID"),
            migrate_to_latest_version: z
                .boolean()
                .optional()
                .describe("Migrate bot schema to latest version (default: false)"),
        },
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            openWorldHint: true,
        },
    }, async ({ typebot_id, migrate_to_latest_version }) => {
        try {
            const data = await apiRequest(`/v1/typebots/${typebot_id}`, "GET", undefined, {
                migrateToLatestVersion: migrate_to_latest_version?.toString(),
            });
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to get typebot: ${error.message}`);
        }
    });
    server.registerTool("create_typebot", {
        title: "Create Typebot",
        description: "Create a new typebot in a workspace. At minimum, provide a workspace ID and bot name.",
        inputSchema: {
            workspace_id: z.string().describe("Workspace ID to create the typebot in"),
            name: z.string().describe("Name for the new typebot"),
            folder_id: z.string().optional().describe("Folder ID to place the typebot in"),
            icon: z.string().optional().describe("Icon emoji or URL for the typebot"),
        },
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            openWorldHint: true,
        },
    }, async ({ workspace_id, name, folder_id, icon }) => {
        try {
            const typebot = { name };
            if (folder_id)
                typebot.folderId = folder_id;
            if (icon)
                typebot.icon = icon;
            const data = await apiRequest("/v1/typebots", "POST", {
                workspaceId: workspace_id,
                typebot,
            });
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to create typebot: ${error.message}`);
        }
    });
    server.registerTool("update_typebot", {
        title: "Update Typebot",
        description: "Update an existing typebot. Pass any subset of typebot fields to update (name, icon, theme, settings, groups, edges, variables, etc.).",
        inputSchema: {
            typebot_id: z.string().describe("Typebot ID to update"),
            typebot: z
                .record(z.unknown())
                .describe("Object with typebot fields to update (name, icon, theme, settings, groups, edges, variables, folderId, etc.)"),
            overwrite: z
                .boolean()
                .optional()
                .describe("Force push even on conflict (default: false)"),
        },
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            openWorldHint: true,
        },
    }, async ({ typebot_id, typebot, overwrite }) => {
        try {
            const body = { typebot };
            if (overwrite !== undefined)
                body.overwrite = overwrite;
            const data = await apiRequest(`/v1/typebots/${typebot_id}`, "PATCH", body);
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to update typebot: ${error.message}`);
        }
    });
    server.registerTool("delete_typebot", {
        title: "Delete Typebot",
        description: "Permanently delete a typebot. This action cannot be undone.",
        inputSchema: {
            typebot_id: z.string().describe("Typebot ID to delete"),
        },
        annotations: {
            readOnlyHint: false,
            destructiveHint: true,
            openWorldHint: true,
        },
    }, async ({ typebot_id }) => {
        try {
            const data = await apiRequest(`/v1/typebots/${typebot_id}`, "DELETE");
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to delete typebot: ${error.message}`);
        }
    });
    server.registerTool("publish_typebot", {
        title: "Publish Typebot",
        description: "Publish a typebot to make it available via its public URL and chat API.",
        inputSchema: {
            typebot_id: z.string().describe("Typebot ID to publish"),
        },
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            openWorldHint: true,
        },
    }, async ({ typebot_id }) => {
        try {
            const data = await apiRequest(`/v1/typebots/${typebot_id}/publish`, "POST");
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to publish typebot: ${error.message}`);
        }
    });
    server.registerTool("unpublish_typebot", {
        title: "Unpublish Typebot",
        description: "Unpublish a typebot to remove it from public access.",
        inputSchema: {
            typebot_id: z.string().describe("Typebot ID to unpublish"),
        },
        annotations: {
            readOnlyHint: false,
            destructiveHint: true,
            openWorldHint: true,
        },
    }, async ({ typebot_id }) => {
        try {
            const data = await apiRequest(`/v1/typebots/${typebot_id}/unpublish`, "POST");
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to unpublish typebot: ${error.message}`);
        }
    });
    server.registerTool("get_published_typebot", {
        title: "Get Published Typebot",
        description: "Get the published version of a typebot. Returns the live configuration with groups, edges, variables, theme and settings.",
        inputSchema: {
            typebot_id: z.string().describe("Typebot ID"),
            migrate_to_latest_version: z
                .boolean()
                .optional()
                .describe("Migrate schema to latest version (default: false)"),
        },
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            openWorldHint: true,
        },
    }, async ({ typebot_id, migrate_to_latest_version }) => {
        try {
            const data = await apiRequest(`/v1/typebots/${typebot_id}/publishedTypebot`, "GET", undefined, {
                migrateToLatestVersion: migrate_to_latest_version?.toString(),
            });
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to get published typebot: ${error.message}`);
        }
    });
}
