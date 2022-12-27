import {Vector2D} from "../../Domain/Models/Maths/Vector2D";
import {HandledEventMap} from "./CanvasEventAdapter";

export type MouseButton = 1|2|3;

export abstract class CanvasEvent {
    private _active: boolean = true;
    get active(): boolean { return this._active; }
    public consume(): void { this._active = false; }
}

export abstract class CanvasMouseEvent extends CanvasEvent {

    private readonly _pos: Vector2D;
    get pos(): Vector2D { return this._pos; }
    
    private readonly _deltaPos: Vector2D;
    get deltaPos(): Vector2D { return this._deltaPos; }
    
    protected constructor(pos: Vector2D, deltaPos: Vector2D) {
        super();
        this._pos = pos; 
        this._deltaPos = deltaPos;
    }
}

export class CanvasClickEvent extends CanvasMouseEvent {
    public constructor(pos: Vector2D, deltaPos: Vector2D) { super(pos, deltaPos); }
}
export class CanvasMoveEvent extends CanvasMouseEvent {
    public constructor(pos: Vector2D, deltaPos: Vector2D) { super(pos, deltaPos); }
}
export class CanvasButtonEvent extends CanvasMouseEvent {
    private readonly _button: MouseButton;
    get button(): MouseButton { return this._button; }
    
    private readonly _btnDown: boolean;
    get btnDown(): boolean { return this._btnDown; }

    public constructor(pos: Vector2D, deltaPos: Vector2D, button: MouseButton, down: boolean) { 
        super(pos, deltaPos);
        this._button = button;
        this._btnDown = down;
    }
}
export class CanvasWheelEvent extends CanvasEvent {
    private readonly _deltaScroll: Vector2D;
    get deltaScroll(): Vector2D { return this._deltaScroll; }
    
    constructor(deltaScroll: Vector2D) {
        super();
        this._deltaScroll = deltaScroll;
    }
}