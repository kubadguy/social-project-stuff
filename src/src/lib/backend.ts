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

    let obj: BackendResponseForAwake | null = null;
    let text = "";

    try {
        // Some servers return empty body or plain text
        const contentType = res.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
            obj = await res.json();
        } else {
            text = await res.text();
        }
    } catch {
        return ["parse", "Parsing error"];
    }

    // If JSON exists and is valid like your expected format
    if (obj) {
        if (res.ok) {
            if (obj.okay) {
                return [1, getBackendMessage(obj)];
            } else {
                return ["backend", getBackendMessage(obj)];
            }
        } else {
            return ["code", getBackendMessage(obj)];
        }
    }

    // Fallback if backend didn't send JSON
    if (!res.ok) {
        return ["code", `HTTP ${res.status} ${res.statusText || ""}`.trim()];
    }

    if (text.trim().length === 0) {
        return ["parse", "Empty response from backend"];
    }

    return ["parse", `Unexpected response: ${text.slice(0, 200)}`];
}

export {
    isBackendAwake
};
