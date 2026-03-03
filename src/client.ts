import { API_KEY, APP_BASE_URL } from "./auth.js";

export class TypebotApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "TypebotApiError";
  }
}

export async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
  body?: Record<string, unknown>,
  queryParams?: Record<string, string | undefined>,
  baseUrl: string = APP_BASE_URL,
): Promise<T> {
  let url = `${baseUrl}${endpoint}`;

  if (queryParams) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined && value !== "") {
        params.set(key, value);
      }
    }
    const qs = params.toString();
    if (qs) url += `?${qs}`;
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
    return {} as T;
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const msg = (error as Record<string, unknown>).message || response.statusText;

    if (response.status === 429) {
      throw new TypebotApiError(429, "Rate limit exceeded. Try again in a moment.");
    }

    throw new TypebotApiError(response.status, `Typebot API error (${response.status}): ${msg}`);
  }

  return (await response.json()) as T;
}

export function toolResult(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

export function toolError(message: string) {
  return {
    isError: true as const,
    content: [{ type: "text" as const, text: message }],
  };
}
