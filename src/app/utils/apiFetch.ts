// import {triggerGlobalError} from "../utils/errorBus.ts";

export async function apiFetch<TResponse, TRequest = unknown>(
    url: string,
    options: {
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
        data?: TRequest;
        headers?: HeadersInit;
    } = {}
): Promise<TResponse> {
    console.info("url",url)
    const {method = 'GET', data, headers} = options;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        ...(data && {body: JSON.stringify(data)}),
    });

    const json = await res.json();
    if (res.status === 401) {
        // triggerGlobalError("Session expired. Please login again.");
        throw new Error(json.message || "Session expired. Please login again.");
    } else if (res.status === 500) {
        const error = new Error("Something went wrong on our end. Please try again later.") as any;
        error.response = res;
        error.body = json;
        throw error;
    }
    console.info(json.status);
    if (!res.ok) {
        // You can throw an object or a custom error that includes both the message and the response
        const error = new Error(json.message || 'API request failed') as any;
        error.response = res;
        error.body = json;
        throw error;
    }

    return json;
}
