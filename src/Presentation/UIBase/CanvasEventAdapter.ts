import {RefObject} from "react";
import {Vector2D} from "../../Domain/Models/Maths/Vector2D";
import {Vector3D} from "../../Domain/Models/Maths/Vector3D";
import {FormatAlignLeft} from "@mui/icons-material";

export type HandledEvent = ( 
    "mouseMove" 
    | "mouseClick"
    | "scroll"
    | "mouseDown"
    | "mouseUp"
    | "mouseScroll"
);

export type CanvasEventHandler = (a: any) => void;
export interface CanvasClickHandler {
    callback: (e: CanvasClickEvent) => void,
    priority: number,
}

export class CanvasClickEvent { 
    private _active: boolean = true;
    get active(): boolean { return this._active; }

    public consume(): void { this._active = false; }
}

export default class CanvasEventAdapter {

    private readonly canvas: HTMLCanvasElement;
    private lastMouseX: number = 0;
    private lastMouseY: number = 0;
    
    private deltaMouseX: number = 0;
    private deltaMouseY: number = 0;

    constructor (canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.addEventListener('wheel', this.handleMouseEvent);
        this.canvas.addEventListener('mousedown', this.handleMouseEvent);
        this.canvas.addEventListener('mouseup', this.handleMouseEvent);
        this.canvas.addEventListener('click', this.handleMouseEvent);
        this.canvas.addEventListener('contextmenu', this.handleMouseEvent);
        this.canvas.addEventListener('mousemove', this.handleMouseEvent);
        this.canvas.addEventListener('wheel', this.handleMouseScrollEvent);
    }
    
    private handleMouseEvent = (evt: any): void => {
        // Forbid the propagation of the event if it was on the canvas
        evt.preventDefault();
        if (evt.type === 'mousemove') { this.handleMouseMoveEvent(evt); }
        if (evt.type === 'mouseup') { this.handleMouseBtnEvent('mouseUp', evt); }
        if (evt.type === 'mousedown') { this.handleMouseBtnEvent('mouseDown', evt); }
        if (evt.type === 'click') { this.handleClickEvent(); }
    }

    private subscribers: Map<HandledEvent, Set<CanvasEventHandler>> = new Map();
    private clickSubscribers: CanvasClickHandler[] = [];

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

    /**
     * Subscribe to a click event on canvas
     * @param handler The callback that handles a {@link CanvasClickHandler}, the priority of the handler
     * is the priority with which the event is handled, handlers with
     * priority of 0 is handled first
     */
    public subscribeClick(handler: CanvasClickHandler) {
        this.clickSubscribers.push(handler);
        this.clickSubscribers.sort((h1, h2) => h2.priority-h1.priority);
    }

    private handleClickEvent() {
        const clickEvt: CanvasClickEvent = new CanvasClickEvent();
        const handlers = [...this.clickSubscribers];
        let handler;
        while (clickEvt.active && handlers.length > 0) {
            handler = handlers.pop();
            // @ts-ignore
            handler.callback(clickEvt);
        }
    }

    private handleMouseScrollEvent = (evt: WheelEvent): void => {
        this.dispatch("mouseScroll", {
            deltaScroll: new Vector2D(evt.deltaX, evt.deltaY),
        });
    }

    private handleMouseMoveEvent = (evt: MouseEvent): void => {
        if (this.canvas === null) { return; }
        const ctx = this.canvas.getContext("2d");
        if (ctx === null) { return; }
        
        const rect = this.canvas.getBoundingClientRect();

        const {x, y} = ctx.getTransform().inverse().transformPoint(new DOMPoint(
            evt.clientX - rect.left, evt.clientY - rect.top
        ));
        
        this.deltaMouseX = evt.movementX;
        this.deltaMouseY = evt.movementY;
        
        this.lastMouseX = x;
        this.lastMouseY = y;

        this.dispatch('mouseMove', {});
    }

    private getMouseState(): any {
        return {
            pos: new Vector2D(this.lastMouseX, this.lastMouseY),
            deltaPos: new Vector2D(this.deltaMouseX, this.deltaMouseY),
        };
    }

    private handleMouseBtnEvent(type: HandledEvent,  evt: MouseEvent) {
        this.dispatch(type, {
            button: evt.button,
        });
    }

    /** Dispatch the event to all subscribers */
    private dispatch(event: HandledEvent, args: any): void {
        if (!this.subscribers.has(event)) { this.subscribers.set(event, new Set()); }
        // @ts-ignore : Thinks the set can still be undefined
        this.subscribers.get(event).forEach(callback => callback({
            ...args,
            ...this.getMouseState(),
            type: event
        }));
    }
}