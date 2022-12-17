import SFVector2DEquation from "../../Domain/Models/Maths/SFVector2DEquation";
import {Joint} from "../../Domain/Models/Joint";
import {Projection} from "../../Domain/Models/Maths/projection/Projection";
import CanvasTool from "../UIBase/CanvasTool";

export abstract class ControlTool implements CanvasTool{

    /**
     * Returns the equation describing which position of mouse will
     * be able to select this tool, or undefined if the tool is not selectable
     */
    public selectionEquation: SFVector2DEquation|undefined;
    
    private _hovered: boolean = false;
    private _selected: boolean = false;


    get hovered(): boolean { return this._hovered; }
    set hovered(value: boolean) { this._hovered = value; }

    get selected(): boolean { return this._selected; }
    set selected(value: boolean) { this._selected = value; }

    /**
     * Draw the tool on the canvas
     * @param ctx The 2d canvas rendering context
     * @param projection The projection to the canvas from 3D space
     * @param joint A selected joint if any
     */
    abstract draw(ctx: CanvasRenderingContext2D, projection: Projection, joint: Joint|undefined): void;
}