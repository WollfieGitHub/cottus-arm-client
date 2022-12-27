import DistanceEquation from "../../Domain/Models/Maths/DistanceEquation";
import {Joint} from "../../Domain/Models/Joint";
import {Projection} from "../../Domain/Models/Maths/Projection/Projection";
import CanvasTool from "../UIBase/CanvasTool";
import {Vector2D} from "../../Domain/Models/Maths/Vector2D";
import {CottusArm} from "../../Domain/Models/CottusArm";

export abstract class ControlTool implements CanvasTool{

    protected static defaultWidth: number = 3.0;
    protected static selectedWidth: number = 12.0;
    
    /**
     * Returns the equation describing which position of mouse will
     * be able to select this tool, or undefined if the tool is not selectable
     */
    public selectionEquation: DistanceEquation|undefined;

    protected _initMousePos: Vector2D = Vector2D.Zero;
    protected _deltaMousePos: Vector2D = Vector2D.Zero;
    protected _currentMousePos: Vector2D = Vector2D.Zero;

    private _selected: boolean = false;
    get selected(): boolean { return this._selected; }

    private _hovered: boolean = false;
    get hovered(): boolean { return this._hovered; }
    set hovered(value: boolean) { this._hovered = value; }
    
    public onSelectBegin(mousePos: Vector2D) {
        this._selected = true;
        this._initMousePos = mousePos;
        this._currentMousePos = this._initMousePos;
    }
    
    public onSelectUpdate(mousePos: Vector2D, arm: CottusArm) {
        this._deltaMousePos = mousePos.subtract(this._currentMousePos);
        this._currentMousePos = mousePos.subtract(this._initMousePos);
        this.onToolUpdate(arm);
    }
    
    protected abstract onToolUpdate(arm: CottusArm): void;
    
    public onSelectEnd(mousePos: Vector2D) { this._selected = false; }
    
    /**
     * Draw the tool on the canvas
     * @param ctx The 2d canvas rendering context
     * @param projection The projection to the canvas from 3D space
     * @param joint A selected joint if any
     */
    abstract draw(ctx: CanvasRenderingContext2D, projection: Projection, joint: Joint|undefined): void;
}