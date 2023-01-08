import {Vector2D} from "../../Domain/Models/Maths/Vector2D";
import {CanvasButtonEvent, CanvasClickEvent, CanvasMoveEvent, CanvasWheelEvent, MouseButton} from "./CanvasEvent";

export interface HandledEventMap {
    "canvasMove": CanvasMoveEvent,
    "canvasClick": CanvasClickEvent,
    "scroll": CanvasWheelEvent,
    "canvasButton": CanvasButtonEvent,
}

export type CanvasCallback<T extends keyof HandledEventMap> = (e: HandledEventMap[T]) => void;
export interface CanvasEventHandler<T extends keyof HandledEventMap> {
    callback: CanvasCallback<T>,
    priority?: number,
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
        if (evt.type === 'mouseup' || evt.type === 'mousedown') { this.handleMouseBtnEvent(evt); }
        if (evt.type === 'click') { this.handleClickEvent(); }
    }

    private subscribers: Map<keyof HandledEventMap, CanvasEventHandler<any>[]> = new Map();

    /**
     * Subscribe to a canvas event 
     * @param event An event handled by the canvas
     * @param handler The callback that handles a {@link CanvasEventHandler}, the priority of the handler
     * is the priority with which the event is handled, handlers with
     * priority of 0 is handled first
     */
    public subscribe<K extends keyof HandledEventMap>(event: K, handler: CanvasEventHandler<K>) {
        if (!this.subscribers.has(event)) { this.subscribers.set(event, []); }
        // @ts-ignore : Thinks the set can still be undefined
        this.subscribers.get(event).push(handler);
        this.subscribers.set(
            // @ts-ignore
            event, this.subscribers.get(event)
                .map(({priority, callback}) => { return {priority: (priority === undefined ? 100 : priority), callback} })
                .sort((h1, h2) => h2.priority-h1.priority)
        )
    }

    private handleClickEvent() {
        const { pos, deltaPos } = this.getMouseState();
        const clickEvt: CanvasClickEvent = new CanvasClickEvent(pos, deltaPos);
        this.dispatch('canvasClick', clickEvt);
    }

    private handleMouseScrollEvent = (evt: WheelEvent): void => {
        this.dispatch('scroll', new CanvasWheelEvent(new Vector2D(evt.deltaX, evt.deltaY)));
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

        this.dispatch('canvasMove', new CanvasMoveEvent(
            new Vector2D(this.lastMouseX, this.lastMouseY),
            new Vector2D(this.deltaMouseX, this.deltaMouseY)
        ));
    }

    private getMouseState(): any {
        return {
            pos: new Vector2D(this.lastMouseX, this.lastMouseY),
            deltaPos: new Vector2D(this.deltaMouseX, this.deltaMouseY),
        };
    }

    private handleMouseBtnEvent(evt: MouseEvent) {
        const { pos, deltaPos } = this.getMouseState();
        this.dispatch('canvasButton', new CanvasButtonEvent(
            pos, deltaPos, evt.button as MouseButton, evt.type === 'mousedown'
        ));
    }

    /** Dispatch the event to all subscribers */
    private dispatch<K extends keyof HandledEventMap>(eventType: K, event: HandledEventMap[K]): void {
        if (!this.subscribers.has(eventType)) { this.subscribers.set(eventType, []); }
        // @ts-ignore : Thinks the set can still be undefined
        const handlers = [...this.subscribers.get(eventType)];
        let handler: CanvasEventHandler<K>;
        while (event.active && (handler = handlers.pop()) !== undefined) {
            handler.callback(event);
        }
    }

    /** Remove all listeners from the canvas */
    public removeListeners() {
        this.canvas.removeEventListener('wheel', this.handleMouseEvent);
        this.canvas.removeEventListener('mousedown', this.handleMouseEvent);
        this.canvas.removeEventListener('mouseup', this.handleMouseEvent);
        this.canvas.removeEventListener('click', this.handleMouseEvent);
        this.canvas.removeEventListener('contextmenu', this.handleMouseEvent);
        this.canvas.removeEventListener('mousemove', this.handleMouseEvent);
        this.canvas.removeEventListener('wheel', this.handleMouseScrollEvent);
    }
}