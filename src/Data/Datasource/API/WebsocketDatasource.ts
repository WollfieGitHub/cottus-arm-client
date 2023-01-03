/**
 * @param T The type of response we expect from the websocket
 */
export default abstract class WebsocketDatasource<T> {
    /** The socket that this datasource to get its resource,
     * it is undefined the time the request for a socket-id is completed */
    private socket: WebSocket | undefined;
    /** The url for the websocket */
    private readonly url: string;
    /** If sets to true, the socket will use exponential reconnection strategy */
    private readonly autoReconnect: boolean;
    /** The last time we tried to connect to the server */
    private lastReconnectionAttempt: number;
    /** Delay between two reconnection attempts */
    private currentReconnectionDelay: number;
    /** True if the last reconnection was successful, false otherwise */
    private lastReconnectionSuccessful: boolean = false;
    
    private currentTimeout: NodeJS.Timeout|null = null;
    
    protected constructor(socketEndPoint: string, autoReconnect: boolean) {
        this.url = "ws://localhost:8080" + socketEndPoint;
        this.autoReconnect = autoReconnect;
        this.lastReconnectionAttempt = new Date().getTime();
        this.currentReconnectionDelay = 1;
        
        this.getIdThenConnect();
    }
    
    private getIdThenConnect(): void {
        fetch("/api/socket-token")
            .then(response => {
                if (response.ok) { response.text().then(this.connect); } 
                else if (this.autoReconnect) { this.tryReconnect(); }
            });
    }
    
    /** "ES6 : Arrow functions, by default, do not re-scope "this" */
    private connect = (connectionId: string): void => {
        const socketUrl: string = this.url + `/${connectionId}`;
        this.socket = new WebSocket(socketUrl);
        
        console.log(`Connecting to ${socketUrl}...`)
        
        // Connection established
        this.socket.onopen = () => {
            console.log(`Websocket connection established using id "${connectionId}" from endPoint "${socketUrl}"`);
            // We successfully connected so reset delay
            this.lastReconnectionSuccessful = true;
        }
        // Connection terminated
        this.socket.onclose = () => {
            console.log(`Websocket connection terminated using id "${connectionId}" from endPoint "${socketUrl}"`);
            if (this.autoReconnect) { this.tryReconnect(); }
        }
        
        // Error handling's almighty strategy : "Better safe than sorry"
        this.socket.onerror = () => { this.socket?.close(); }
        // Data handling
        this.socket.onmessage = (ev) => { this.onMessageReceived(JSON.parse(ev.data) as T); };
    }
    
    private tryReconnect = () => {
        if (this.lastReconnectionSuccessful) { this.currentReconnectionDelay = 1; }
        // Exponentially increase the reconnection delay on failure
        else { this.currentReconnectionDelay *= 2; }
        
        const current: number = new Date().getTime();
        if (current - this.lastReconnectionAttempt >= this.currentReconnectionDelay * 1000) {
            this.lastReconnectionAttempt = current;
            this.getIdThenConnect();
        } else { 
            console.log(`Next reconnection attempt in ${this.currentReconnectionDelay} seconds...`)
            this.currentTimeout = setTimeout(this.tryReconnect, this.currentReconnectionDelay*1000+1);
        }
    }
    
    /** @return The number of seconds that this socket must wait to try and reconnect */
    public getCurrentDelay(): number { return this.currentReconnectionDelay; }

    /**
     * Handles the reception of a message from the internal websocket
     * @param msg The message received, of type T
     */
    protected abstract onMessageReceived(msg: T): void;
    
    /** Reset the reconnection delay to 1 sec and tries to reconnect immediately */
    public resetReconnectionDelay(): void {
        this.currentReconnectionDelay = 1;
        // Cancels the current timeout if any
        if (this.currentTimeout !== null) { clearTimeout(this.currentTimeout); }
        
        // Try to reconnect
        this.tryReconnect();
    }
}