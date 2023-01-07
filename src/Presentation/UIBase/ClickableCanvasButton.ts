import {Rect} from "../../Domain/Models/Maths/Shapes/Rect";
import {Vector2D} from "../../Domain/Models/Maths/Vector2D";

export abstract class ClickableCanvasButton {

    private _onClick: OnClick;
    set onClick(value: OnClick) { this._onClick = value; }

    /**
     * @return Rect The rectangle object which gives the position and
     * dimensions of the button
     */
    abstract getBoundingBox(): Rect;

    /**
     * Returns True if the mouse coordinates x,y are contained in the button's
     * bounding box
     * @param x The x coordinate for the mouse
     * @param y The y coordinate for the mouse
     */
    isHovering(x: number, y: number): boolean {
        return this.getBoundingBox().contains(new Vector2D(x,y));
    }

    /** Called when the button is clicked */
    click(): void {
        if (this._onClick !== undefined) { this._onClick(); }
        else { console.warn('this.onClick parameter is undefined, did you mean to do that ?'); }
    }
}

export type OnClick = (() => void)|undefined;