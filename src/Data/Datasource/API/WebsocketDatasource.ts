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
    /** Delay between two reconnection attempts */
    private currentReconnectionDelay: number;
    /** True if the last reconnection was successful, false otherwise */
    private lastReconnectionSuccessful: boolean = false;
    /** Time in ms since epoch of the next reconnection attempt */
    private nextReconnectionTime: number = Date.now();
    
    /** The attempt to reconnect */
    private currentTimeout: NodeJS.Timeout|null = null;

    /** Handling of Linear vs Exponential Backoff */
    private static NbAttemptsBeforeExponentialTimeout: number = 3;
    private nbLinearAttempts: number = 0;
    private exponentialBackoff: boolean = false;
    
    /** If the socket is connected to the server or not */
    public connected: boolean = false;
    
    protected constructor(socketEndPoint: string, autoReconnect: boolean) {
        this.url = "ws://localhost:8080" + socketEndPoint;
        this.autoReconnect = autoReconnect;
        this.currentReconnectionDelay = 1;
        
        this.getIdThenConnect();
    }
    
    private getIdThenConnect(): void {
        fetch("/api/socket-token")
            .then(response => {
                if (response.ok) { response.text().then(this.connect); } 
                else if (this.autoReconnect) { this.tryReconnect(); this.lastReconnectionSuccessful = false; }
            })
            .catch(reason => { if (this.autoReconnect) { this.tryReconnect(); this.lastReconnectionSuccessful = false; } });
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
            // Go back to linear mode
            this.exponentialBackoff = false;
            this.connected = true;
        }
        // Connection terminated
        this.socket.onclose = () => {
            console.log(`Websocket connection terminated using id "${connectionId}" from endPoint "${socketUrl}"`);
            this.connected = false;
            if (this.autoReconnect) { this.tryReconnect(); }
        }
        
        // Error handling's almighty strategy : "Better safe than sorry"
        this.socket.onerror = () => { this.socket?.close(); this.connected = false; }
        // Data handling
        this.socket.onmessage = (ev) => { this.onMessageReceived(JSON.parse(ev.data) as T); };
    }
    
    private tryReconnect = () => {
        
        // If we just got out of a timeout callback
        if (this.currentTimeout !== null) {
            
            clearTimeout(this.currentTimeout);
            this.currentTimeout = null;

            this.getIdThenConnect();
        } else {

            // Update the reconnection delay
            if (this.lastReconnectionSuccessful) { this.currentReconnectionDelay = 1; this.nbLinearAttempts = 1; }
            // Exponentially increase the reconnection delay on failure if we are in exponential backoff
            else if (this.exponentialBackoff) { this.currentReconnectionDelay *= 2; this.nbLinearAttempts += 1; }
            // Or set the delay to 2 if we are still in linear mode
            else { this.currentReconnectionDelay = 2; this.nbLinearAttempts += 1; }
            
            // Switch to exponential mode if we tried too many times
            if (this.nbLinearAttempts > WebsocketDatasource.NbAttemptsBeforeExponentialTimeout) {
                this.exponentialBackoff = true;
            }
            
            // Retry in "currentReconnectionDelay" seconds
            const reconnectionDelayMs = this.currentReconnectionDelay*1000;
            this.currentTimeout = setTimeout(this.tryReconnect, reconnectionDelayMs);
            this.nextReconnectionTime = Date.now() + reconnectionDelayMs;
            
            console.log(`Next reconnection attempt in ${this.currentReconnectionDelay} seconds...`)
        }
    }
    
    /** @return The number of seconds that this socket must wait to try and reconnect */
    public getCurrentDelay = () => {
        return Math.abs((this.nextReconnectionTime - Date.now()) / 1000);
    }

    /**
     * Handles the reception of a message from the internal websocket
     * @param msg The message received, of type T
     */
    protected abstract onMessageReceived(msg: T): void;
    
    /** Reset the reconnection delay to 1 sec and tries to reconnect immediately */
    public resetReconnectionDelay(): void {
        // Reset retry strategy
        this.currentReconnectionDelay = 1;
        this.nbLinearAttempts = 0;
        this.exponentialBackoff = false;
        // Cancels the current timeout if any
        if (this.currentTimeout !== null) { clearTimeout(this.currentTimeout); }
        
        // Try to reconnect
        this.tryReconnect();
    }
}