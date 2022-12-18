import {RefObject} from "react";
import {Vector2D} from "../../Domain/Models/Maths/Vector2D";
import {Vector3D} from "../../Domain/Models/Maths/Vector3D";

export type HandledEvent = ( 
    "mouseMove" 
    | "mouseClick"
    | "scroll"
    | "mouseDown"
    | "mouseUp"
);

export type CanvasEventHandler = (a: any) => void;

export default class CanvasEventAdapter {

    private canvas: HTMLCanvasElement;
    private lastMouseX: number = 0;
    private lastMouseY: number = 0;
    
    private deltaMouseX: number = 0;
    private deltaMouseY: number = 0;

    constructor (canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.addEventListener('wheel', this.handleMouseEvent);
        this.canvas.addEventListener('mousedown', this.handleMouseEvent);
        this.canvas.addEventListener('mousedown', this.handleMouseEvent);
        this.canvas.addEventListener('click', this.handleMouseEvent);
        this.canvas.addEventListener('contextmenu', this.handleMouseEvent);
        this.canvas.addEventListener('mousemove', this.handleMouseEvent);
    }
    
    private handleMouseEvent = (evt: any): void => {
        // Forbid the propagation of the event if it was on the canvas
        evt.preventDefault();
        if (evt.type === 'mousemove') { 
            this.updateMouseState(evt);
            this.dispatch('mouseMove', this.getMouseState()); 
        }
        if (evt.type === 'mouseUp' || evt.type === 'mouseDown') { this.handleMouseBtnEvent(evt); }
    }

    private subscribers: Map<HandledEvent, Set<CanvasEventHandler>> = new Map();

    /**
     * Subscribe to a canvas event 
     * @param event An event handled by the canvas
     * @param callback A callback when the event occurs
     */
    public subscribe(event: HandledEvent, callback: CanvasEventHandler) {
        if (!this.subscribers.has(event)) { this.subscribers.set(event, new Set()); }
        // @ts-ignore : Thinks the set can still be undefined
        this.subscribers.get(event).add(callback);
    }
    
    private updateMouseState = (evt: MouseEvent): void => {
        if (this.canvas === null) { return; }
        const ctx = this.canvas.getContext("2d");
        if (ctx === null) { return; }
        
        const rect = this.canvas.getBoundingClientRect();

        const {x, y} = ctx.getTransform().inverse().transformPoint(new DOMPoint(
            evt.clientX - rect.left, evt.clientY - rect.top
        ));
        
        this.deltaMouseX = x - this.deltaMouseX;
        this.deltaMouseY = y - this.deltaMouseY;
        
        this.lastMouseX = x;
        this.lastMouseY = y;
    }

    private getMouseState(): any {
        return {
            pos: new Vector2D(this.lastMouseX, this.lastMouseY),
            deltaPos: new Vector2D(this.deltaMouseX, this.deltaMouseY),
        };
    }
    
    private handleMouseBtnEvent(evt: MouseEvent) {
        this.dispatch(evt.type === 'mouseDown' ? 'mouseDown' : 'mouseUp', {
            button: evt.button,
        });
    }

    /** Dispatch the event to all subscribers */
    private dispatch(event: HandledEvent, args: any): void {
        if (!this.subscribers.has(event)) { this.subscribers.set(event, new Set()); }
        // @ts-ignore : Thinks the set can still be undefined
        this.subscribers.get(event).forEach(callback => callback.apply({
            ...args,
            ...this.getMouseState(),
            type: event
        }));
    }
}