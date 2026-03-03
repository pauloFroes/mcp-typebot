#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTypebotTools } from "./tools/typebots.js";
import { registerResultTools } from "./tools/results.js";
import { registerChatTools } from "./tools/chat.js";
import { registerWorkspaceTools } from "./tools/workspaces.js";
import { registerFolderTools } from "./tools/folders.js";
import { registerBillingTools } from "./tools/billing.js";
const server = new McpServer({
    name: "mcp-typebot",
    version: "1.0.0",
});
registerTypebotTools(server);
registerResultTools(server);
registerChatTools(server);
registerWorkspaceTools(server);
registerFolderTools(server);
registerBillingTools(server);
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("mcp-typebot server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
