import { z } from "zod";
import { apiRequest, toolResult, toolError } from "../client.js";
export function registerResultTools(server) {
    server.registerTool("list_results", {
        title: "List Results",
        description: "List conversation results (submissions) for a typebot. Each result contains variables, answers, and completion status. Supports cursor-based pagination.",
        inputSchema: {
            typebot_id: z.string().describe("Typebot ID to list results from"),
            limit: z
                .string()
                .optional()
                .describe("Number of results per page (1-500, default: 50)"),
            cursor: z
                .string()
                .optional()
                .describe("Cursor for pagination (from nextCursor in previous response)"),
            time_filter: z
                .enum([
                "today",
                "last7Days",
                "last30Days",
                "monthToDate",
                "lastMonth",
                "yearToDate",
                "allTime",
            ])
                .optional()
                .describe("Time period filter (default: last7Days)"),
            time_zone: z.string().optional().describe("Timezone for time filter (e.g. America/Sao_Paulo)"),
        },
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            openWorldHint: true,
        },
    }, async ({ typebot_id, limit, cursor, time_filter, time_zone }) => {
        try {
            const data = await apiRequest(`/v1/typebots/${typebot_id}/results`, "GET", undefined, {
                limit,
                cursor,
                timeFilter: time_filter,
                timeZone: time_zone,
            });
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to list results: ${error.message}`);
        }
    });
    server.registerTool("get_result", {
        title: "Get Result",
        description: "Get a specific conversation result by ID. Returns variables, answers, completion status and metadata.",
        inputSchema: {
            typebot_id: z.string().describe("Typebot ID"),
            result_id: z.string().describe("Result ID"),
        },
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            openWorldHint: true,
        },
    }, async ({ typebot_id, result_id }) => {
        try {
            const data = await apiRequest(`/v1/typebots/${typebot_id}/results/${result_id}`);
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to get result: ${error.message}`);
        }
    });
    server.registerTool("delete_results", {
        title: "Delete Results",
        description: "Delete conversation results from a typebot. Pass specific result IDs or omit to delete ALL results. This action cannot be undone.",
        inputSchema: {
            typebot_id: z.string().describe("Typebot ID"),
            result_ids: z
                .string()
                .optional()
                .describe("Comma-separated result IDs to delete. If omitted, ALL results are deleted."),
        },
        annotations: {
            readOnlyHint: false,
            destructiveHint: true,
            openWorldHint: true,
        },
    }, async ({ typebot_id, result_ids }) => {
        try {
            const data = await apiRequest(`/v1/typebots/${typebot_id}/results`, "DELETE", undefined, { resultIds: result_ids });
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to delete results: ${error.message}`);
        }
    });
    server.registerTool("list_result_logs", {
        title: "List Result Logs",
        description: "List execution logs for a specific result. Useful for debugging bot behavior. Returns log entries with status, description and details.",
        inputSchema: {
            typebot_id: z.string().describe("Typebot ID"),
            result_id: z.string().describe("Result ID"),
        },
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            openWorldHint: true,
        },
    }, async ({ typebot_id, result_id }) => {
        try {
            const data = await apiRequest(`/v1/typebots/${typebot_id}/results/${result_id}/logs`);
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to list result logs: ${error.message}`);
        }
    });
    server.registerTool("get_stats", {
        title: "Get Typebot Stats",
        description: "Get analytics stats for a typebot: total views, total starts, and total completed conversations.",
        inputSchema: {
            typebot_id: z.string().describe("Typebot ID"),
            time_filter: z
                .enum([
                "today",
                "last7Days",
                "last30Days",
                "monthToDate",
                "lastMonth",
                "yearToDate",
                "allTime",
            ])
                .optional()
                .describe("Time period filter (default: last7Days)"),
            time_zone: z.string().optional().describe("Timezone for time filter (e.g. America/Sao_Paulo)"),
        },
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            openWorldHint: true,
        },
    }, async ({ typebot_id, time_filter, time_zone }) => {
        try {
            const data = await apiRequest(`/v1/typebots/${typebot_id}/analytics/stats`, "GET", undefined, {
                timeFilter: time_filter,
                timeZone: time_zone,
            });
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to get stats: ${error.message}`);
        }
    });
}
