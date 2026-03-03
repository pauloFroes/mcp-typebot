export declare class TypebotApiError extends Error {
    status: number;
    constructor(status: number, message: string);
}
export declare function apiRequest<T>(endpoint: string, method?: "GET" | "POST" | "PATCH" | "DELETE", body?: Record<string, unknown>, queryParams?: Record<string, string | undefined>, baseUrl?: string): Promise<T>;
export declare function toolResult(data: unknown): {
    content: {
        type: "text";
        text: string;
    }[];
};
export declare function toolError(message: string): {
    isError: true;
    content: {
        type: "text";
        text: string;
    }[];
};
