import {OnMessageCallback, WebSocketHook} from "./WebSocketTypes";
import {BASE_WEBSOCKET_URL} from "../Constants";

const sockets: Map<string, {socket: WebSocket, subscribers: Map<number, OnMessageCallback>}>
    = new Map<string, {socket: WebSocket; subscribers: Map<number, OnMessageCallback>}>();
const endPointToId: Map<string, string> = new Map<string, string>();

export const useWebSocket = (urlEndPoint: string): WebSocketHook => {

    const getConnectionId = () => endPointToId.get(urlEndPoint);

    const getSubscriberSet = () => {
        const id: string | undefined = endPointToId.get(urlEndPoint);
        if (id !== undefined) {
            return sockets.get(id)?.subscribers;
        } else return undefined;
    }

    const onMessageReceived = (msg: string): void => {
        const json: any = JSON.parse(msg);
        getSubscriberSet()?.forEach(callback => callback(json));
    }

    const sendMessage = (msg: string): void => {
        const id: string | undefined = getConnectionId();
        if (id !== undefined) { sockets.get(id)?.socket.send(msg); }
    }

    const subscribe = (callback: OnMessageCallback): number => {
        const subscriberId: number = Date.now();

        if (!sockets.has(urlEndPoint)) {
            fetch("/api/socket-id")
                .then(data => data.text())
                .then(connectionId => {
                    endPointToId.set(urlEndPoint, connectionId);
                    const socket: WebSocket = new WebSocket(`${BASE_WEBSOCKET_URL + urlEndPoint}/${connectionId}`);
                    sockets.set(connectionId, {socket: socket, subscribers: new Map<number, OnMessageCallback>()});
                    socket.onopen = () => console.log(`ebsocket connection established using id "${connectionId}" from endPoint "${urlEndPoint}"`);
                    socket.onclose = () => console.log(`Websocket connection terminated using id "${connectionId}" from endPoint "${urlEndPoint}"`);
                    socket.onmessage = (ev) => { onMessageReceived(ev.data); };
                    getSubscriberSet()?.set(subscriberId, callback);
                })
            return subscriberId;
        } else {
            getSubscriberSet()?.set(subscriberId, callback);
            return subscriberId;
        }
    }

    const unsubscribe = (subscriberId: number): void => {
        if (getSubscriberSet()?.has(subscriberId)) {
            getSubscriberSet()?.delete(subscriberId);
        }
    }

    return {
        sendMessage,
        subscribe,
        unsubscribe
    }
}

