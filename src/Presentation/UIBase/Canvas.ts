import CanvasEventAdapter, {CanvasClickHandler, CanvasEventHandler, HandledEvent} from "./CanvasEventAdapter";

export default class Canvas {
    /** The actual canvas element */
    private readonly canvas: HTMLCanvasElement;
    /** The canvas rendering context */
    private _ctx?: CanvasRenderingContext2D;
    /** The event adapter for the canvas */
    private eventAdapter: CanvasEventAdapter;
    
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.eventAdapter = new CanvasEventAdapter(this.canvas);
    }

    /** @return The canvas element */
    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    /**
     * Add an event listener on the specified event. Every time the event occurs,
     * the handler will get called with parameters proper to the event
     * @param e The event to listen to
     * @param handler A handler for the event
     */
    public addListener(e: HandledEvent, handler: CanvasEventHandler|CanvasClickHandler) {
        if (e === "mouseClick") {
            this.eventAdapter.subscribeClick(handler as CanvasClickHandler);
            
        } else { this.eventAdapter.subscribe(e, handler as CanvasEventHandler) }
    }
    
    /** @return The canvas rendering context */
    public getCtx(): CanvasRenderingContext2D|undefined {
        if (this._ctx === undefined) {
            
            const ctx = this.canvas.getContext('2d');
            this._ctx = ctx || undefined;
        }
        return this._ctx;
    }
}
