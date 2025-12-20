function getBackendMessage(response: BackendResponseForAwake): string {
    return response.message;
}

interface BackendResponseForAwake {
    okay: boolean;
    message: string;
}

export {
    getBackendMessage
};
export type {
    BackendResponseForAwake
};
