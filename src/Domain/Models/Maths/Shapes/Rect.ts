import {Vector2D} from "../Vector2D";

export class Rect {
    public readonly pos: Vector2D;
    /** Dimensions */
    public readonly dim: Vector2D;
    
    constructor(pos: Vector2D, dim: Vector2D) {
        this.pos = pos;
        this.dim = dim;
    }

    /**
     * Returns True if the given point is contained in the rectangle
     * @param point The point in 2d Space
     */
    contains(point: Vector2D): boolean {
        const { x, y } =  point.subtract(this.pos);
        return x >= 0 && x <= this.dim.x 
            && y >= 0 && y <= this.dim.y
    }
}
