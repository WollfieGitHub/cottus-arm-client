
export type WebSocketHook = {
    sendMessage: (message: string) => void,
    subscribe: (callback: OnMessageCallback) => number,
    unsubscribe: (subscriberId: number) => void
}

export type OnMessageCallback = (message: any) => void;
