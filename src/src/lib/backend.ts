import { BACKEND_URL } from './config';

export async function isBackendAwake() {
    try {
        const res = await fetch(`${BACKEND_URL}/health`, {
            cache: 'no-store'
        });
        return res.ok;
    } catch {
        return false;
    }
}
