import { BACKEND_URL } from './config';
import { type BackendResponseForAwake, getBackendMessage } from "./utils";

async function isBackendAwake(): Promise<[string | number, string]> {
    let res: Response;

    try {
        res = await fetch(`${BACKEND_URL}/cont/is_alive`, {
            cache: 'no-store',
            signal: AbortSignal.timeout(1500)
        });
    } catch {
        return [0, "Backend Not Alive"];
    }

    // If the backend returns a 503, it's likely still waking up (Render free tier).
    if (res.status === 503) {
        return ["waking", "Backend is warming up…"];
    }

    const contentType = res.headers.get("content-type") || "";

    // Backend is returning HTML → means it's booting (e.g., Render default page during cold start)
    if (contentType.includes("text/html")) {
        return ["waking", "Backend is waking up"];
    }

    // Try JSON only if it looks like JSON
    if (!contentType.includes("application/json")) {
        const text = await res.text().catch(() => "");
        if (!text.trim()) {
            return ["parse", "Empty response from backend"];
        }
        return ["parse", "Unexpected non-JSON response"];
    }

    let obj: BackendResponseForAwake;

    try {
        obj = await res.json();
    } catch {
        return ["parse", "Parsing error"];
    }

    if (res.ok) {
        if (obj.okay) {
            return [1, getBackendMessage(obj)];
        } else {
            return ["backend", getBackendMessage(obj)];
        }
    } else {
        // For other non-OK status codes with JSON, use the message from the backend if available.
        // Otherwise, provide a generic message.
        return ["code", obj.message || `Backend error: HTTP ${res.status}`];
    }
}

export {
    isBackendAwake
};
