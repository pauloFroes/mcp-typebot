import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiRequest, toolResult, toolError } from "../client.js";

export function registerWorkspaceTools(server: McpServer) {
  server.registerTool(
    "list_workspaces",
    {
      title: "List Workspaces",
      description:
        "List all workspaces the authenticated user has access to. Returns id, name, icon and plan for each workspace.",
      inputSchema: {},
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async () => {
      try {
        const data = await apiRequest("/v1/workspaces");
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to list workspaces: ${(error as Error).message}`);
      }
    },
  );

  server.registerTool(
    "get_workspace",
    {
      title: "Get Workspace",
      description:
        "Get detailed information about a workspace including plan, limits, suspension status, and verification.",
      inputSchema: {
        workspace_id: z.string().describe("Workspace ID"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ workspace_id }) => {
      try {
        const data = await apiRequest(`/v1/workspaces/${workspace_id}`);
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to get workspace: ${(error as Error).message}`);
      }
    },
  );

  server.registerTool(
    "create_workspace",
    {
      title: "Create Workspace",
      description: "Create a new workspace.",
      inputSchema: {
        name: z.string().describe("Workspace name"),
        icon: z.string().optional().describe("Workspace icon emoji or URL"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ name, icon }) => {
      try {
        const body: Record<string, unknown> = { name };
        if (icon) body.icon = icon;

        const data = await apiRequest("/v1/workspaces", "POST", body);
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to create workspace: ${(error as Error).message}`);
      }
    },
  );

  server.registerTool(
    "update_workspace",
    {
      title: "Update Workspace",
      description: "Update a workspace name or icon.",
      inputSchema: {
        workspace_id: z.string().describe("Workspace ID to update"),
        name: z.string().describe("New workspace name"),
        icon: z.string().optional().describe("New workspace icon"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ workspace_id, name, icon }) => {
      try {
        const body: Record<string, unknown> = { name };
        if (icon) body.icon = icon;

        const data = await apiRequest(`/v1/workspaces/${workspace_id}`, "PATCH", body);
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to update workspace: ${(error as Error).message}`);
      }
    },
  );

  server.registerTool(
    "delete_workspace",
    {
      title: "Delete Workspace",
      description:
        "Permanently delete a workspace and all its typebots. This action cannot be undone.",
      inputSchema: {
        workspace_id: z.string().describe("Workspace ID to delete"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: true,
      },
    },
    async ({ workspace_id }) => {
      try {
        const data = await apiRequest(`/v1/workspaces/${workspace_id}`, "DELETE");
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to delete workspace: ${(error as Error).message}`);
      }
    },
  );

  server.registerTool(
    "list_workspace_members",
    {
      title: "List Workspace Members",
      description:
        "List all members of a workspace. Returns user info (name, email, image) and role (ADMIN, MEMBER, GUEST).",
      inputSchema: {
        workspace_id: z.string().describe("Workspace ID"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ workspace_id }) => {
      try {
        const data = await apiRequest(`/v1/workspaces/${workspace_id}/members`);
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to list workspace members: ${(error as Error).message}`);
      }
    },
  );
}
