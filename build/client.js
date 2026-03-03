import { API_KEY, APP_BASE_URL } from "./auth.js";
export class TypebotApiError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = "TypebotApiError";
    }
}
export async function apiRequest(endpoint, method = "GET", body, queryParams, baseUrl = APP_BASE_URL) {
    let url = `${baseUrl}${endpoint}`;
    if (queryParams) {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined && value !== "") {
                params.set(key, value);
            }
        }
        const qs = params.toString();
        if (qs)
            url += `?${qs}`;
    }
    const response = await fetch(url, {
        method,
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            Accept: "application/json",
            ...(body ? { "Content-Type": "application/json" } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (response.status === 204) {
        return {};
    }
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const msg = error.message || response.statusText;
        if (response.status === 429) {
            throw new TypebotApiError(429, "Rate limit exceeded. Try again in a moment.");
        }
        throw new TypebotApiError(response.status, `Typebot API error (${response.status}): ${msg}`);
    }
    return (await response.json());
}
export function toolResult(data) {
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
}
export function toolError(message) {
    return {
        isError: true,
        content: [{ type: "text", text: message }],
    };
}
