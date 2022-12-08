/**
 * @param T The type of response we expect from the websocket
 */
export default abstract class WebsocketDatasource<T> {
    /** The socket that this datasource to get its resource,
     * it is undefined the time the request for a socket-id is completed */
    private socket: WebSocket | undefined;
    
    constructor(socketUrl: string) {
        fetch("/api/socket-id")
            .then(data => data.text())
            .then(connectionId => {
                this.socket = new WebSocket(socketUrl);
                this.socket.onopen = () => console.log(`Websocket connection established using id "${connectionId}" from endPoint "${socketUrl}"`);
                this.socket.onclose = () => console.log(`Websocket connection terminated using id "${connectionId}" from endPoint "${socketUrl}"`);
                this.socket.onmessage = (ev) => { this.onMessageReceived(ev.data as T); };
            });
    }

    /**
     * Handles the reception of a message from the internal websocket
     * @param msg The message received, of type T
     */
    protected abstract onMessageReceived(msg: T): void;
}