import { BACKEND_URL } from './config';
import { type BackendResponseForAwake, getBackendMessage } from "./utils";

async function isBackendAwake(): Promise<[string | number, string]> {
    let res: Response;
    let obj: BackendResponseForAwake;

    try {
        res = await fetch(`${BACKEND_URL}/cont/is_alive`, {
            cache: 'no-store',
            signal: AbortSignal.timeout(1500)
        });
    } catch {
        return [0, "Backend Not Alive"];
    }

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
        return ["code", getBackendMessage(obj)];
    }
}

export {
    isBackendAwake
};
