import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiRequest, toolResult, toolError } from "../client.js";

export function registerBillingTools(server: McpServer) {
  server.registerTool(
    "get_billing_usage",
    {
      title: "Get Billing Usage",
      description:
        "Get the current billing usage for a workspace. Returns total chats used and when the usage resets.",
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
        const data = await apiRequest("/v1/billing/usage", "GET", undefined, {
          workspaceId: workspace_id,
        });
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to get billing usage: ${(error as Error).message}`);
      }
    },
  );

  server.registerTool(
    "list_invoices",
    {
      title: "List Invoices",
      description:
        "List billing invoices for a workspace. Returns invoice ID, URL, amount, currency and date.",
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
        const data = await apiRequest("/v1/billing/invoices", "GET", undefined, {
          workspaceId: workspace_id,
        });
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to list invoices: ${(error as Error).message}`);
      }
    },
  );
}
