import { z } from "zod";
import { apiRequest, toolResult, toolError } from "../client.js";
import { CHAT_BASE_URL } from "../auth.js";
export function registerChatTools(server) {
    server.registerTool("start_chat", {
        title: "Start Chat",
        description: "Start a new chat session with a published typebot. Returns a sessionId for continuing the conversation, plus initial bot messages and input prompts. Use the bot's public ID (not the internal typebot ID).",
        inputSchema: {
            public_id: z.string().describe("The bot's public ID (visible in share settings, different from internal typebotId)"),
            message: z
                .string()
                .optional()
                .describe("Optional initial text message to send to the bot"),
            prefilled_variables: z
                .record(z.string())
                .optional()
                .describe("Key-value pairs to prefill bot variables (e.g. {name: 'John', email: 'john@example.com'})"),
            is_stream_enabled: z
                .boolean()
                .optional()
                .describe("Enable OpenAI streaming on client (default: false)"),
            text_bubble_content_format: z
                .enum(["richText", "markdown"])
                .optional()
                .describe("Format for text bubble content (default: richText)"),
        },
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            openWorldHint: true,
        },
    }, async ({ public_id, message, prefilled_variables, is_stream_enabled, text_bubble_content_format }) => {
        try {
            const body = {};
            if (message)
                body.message = { type: "text", text: message };
            if (prefilled_variables)
                body.prefilledVariables = prefilled_variables;
            if (is_stream_enabled !== undefined)
                body.isStreamEnabled = is_stream_enabled;
            if (text_bubble_content_format)
                body.textBubbleContentFormat = text_bubble_content_format;
            const data = await apiRequest(`/v1/typebots/${public_id}/startChat`, "POST", body, undefined, CHAT_BASE_URL);
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to start chat: ${error.message}`);
        }
    });
    server.registerTool("continue_chat", {
        title: "Continue Chat",
        description: "Continue an existing chat session by sending a message. Use the sessionId from startChat response. Returns bot messages and next input prompt.",
        inputSchema: {
            session_id: z.string().describe("Session ID from startChat response"),
            message: z
                .string()
                .optional()
                .describe("Text message to send to the bot"),
            text_bubble_content_format: z
                .enum(["richText", "markdown"])
                .optional()
                .describe("Format for text bubble content (default: richText)"),
        },
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            openWorldHint: true,
        },
    }, async ({ session_id, message, text_bubble_content_format }) => {
        try {
            const body = {};
            if (message)
                body.message = { type: "text", text: message };
            if (text_bubble_content_format)
                body.textBubbleContentFormat = text_bubble_content_format;
            const data = await apiRequest(`/v1/sessions/${session_id}/continueChat`, "POST", body, undefined, CHAT_BASE_URL);
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to continue chat: ${error.message}`);
        }
    });
    server.registerTool("start_preview_chat", {
        title: "Start Preview Chat",
        description: "Start a preview chat session for testing a typebot. Answers are NOT saved. Uses the internal typebot ID (not public ID). Optionally start from a specific group or event.",
        inputSchema: {
            typebot_id: z.string().describe("Internal typebot ID (from the editor URL)"),
            message: z
                .string()
                .optional()
                .describe("Optional initial text message"),
            start_from_group_id: z
                .string()
                .optional()
                .describe("Group ID to start from (skips to a specific flow group)"),
            start_from_event_id: z
                .string()
                .optional()
                .describe("Event ID to start from"),
            prefilled_variables: z
                .record(z.string())
                .optional()
                .describe("Key-value pairs to prefill bot variables"),
            text_bubble_content_format: z
                .enum(["richText", "markdown"])
                .optional()
                .describe("Format for text bubble content (default: richText)"),
        },
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            openWorldHint: true,
        },
    }, async ({ typebot_id, message, start_from_group_id, start_from_event_id, prefilled_variables, text_bubble_content_format, }) => {
        try {
            const body = {};
            if (message)
                body.message = { type: "text", text: message };
            if (prefilled_variables)
                body.prefilledVariables = prefilled_variables;
            if (text_bubble_content_format)
                body.textBubbleContentFormat = text_bubble_content_format;
            if (start_from_group_id)
                body.startFrom = { type: "group", groupId: start_from_group_id };
            else if (start_from_event_id)
                body.startFrom = { type: "event", eventId: start_from_event_id };
            const data = await apiRequest(`/v1/typebots/${typebot_id}/preview/startChat`, "POST", body, undefined, CHAT_BASE_URL);
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to start preview chat: ${error.message}`);
        }
    });
}
