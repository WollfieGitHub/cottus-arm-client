import {RefObject} from "react";
import CanvasEventAdapter, {CanvasEventHandler, HandledEvent} from "./CanvasEventAdapter";

export default class Canvas {
    /** A ref to the canvas element */
    private ref: RefObject<HTMLCanvasElement>;
    /** The actual canvas element */
    private canvas?: HTMLCanvasElement;
    /** The canvas rendering context */
    private ctx?: CanvasRenderingContext2D;
    /** The event adapter for the canvas */
    private eventAdapter: CanvasEventAdapter;


    constructor(ref: RefObject<HTMLCanvasElement>) {
        this.ref = ref;
        this.eventAdapter = new CanvasEventAdapter(ref);
    }

    /** @return The canvas element */
    public getCanvas(): HTMLCanvasElement|undefined {
        if (this.canvas === undefined && this.ref.current !== null) { 
            this.canvas = this.ref.current;
        }
        return this.canvas;
    }

    /**
     * Add an event listener on the specified event. Every time the event occurs,
     * the handler will get called with parameters proper to the event
     * @param e The event to listen to
     * @param handler A handler for the event
     */
    public addListener(e: HandledEvent, handler: CanvasEventHandler) {
        this.eventAdapter.subscribe(e, handler);
    }
    
    /** @return The canvas rendering context */
    public getCtx(): CanvasRenderingContext2D|undefined {
        if (this.ctx === undefined && this.canvas !== undefined) { 
            const ctx = this.canvas.getContext('2d');
            this.ctx = ctx || undefined;
        }
        return this.ctx;
    }
}
