import { BACKEND_URL } from './config';
import { type BackendResponseForAwake, getBackendMessage } from "./utils";

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 3000; // 3 seconds

async function isBackendAwake(retriesLeft = MAX_RETRIES): Promise<[string | number, string]> {
    let res: Response;

    try {
        res = await fetch(`${BACKEND_URL}/cont/is_alive`, {
            cache: 'no-store',
            signal: AbortSignal.timeout(1500)
        });
    } catch {
        // If fetch fails, and retries are left, try again.
        if (retriesLeft > 0) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
            return isBackendAwake(retriesLeft - 1);
        }
        return [0, "Backend Not Alive"];
    }

    const contentType = res.headers.get("content-type") || "";

    // If the backend returns a 503 or HTML, it's likely still waking up (Render free tier).
    if (res.status === 503 || contentType.includes("text/html")) {
        if (retriesLeft > 0) {
            // console.log(`Backend waking up, retrying in ${RETRY_DELAY_MS / 1000} seconds... (${retriesLeft} retries left)`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
            return isBackendAwake(retriesLeft - 1);
        }
        return ["waking", "Backend is warming up…"];
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
