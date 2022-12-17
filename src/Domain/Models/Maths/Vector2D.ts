import {Vector3D} from "./Vector3D";

export class Vector2D extends Vector3D{
    
    constructor(x: number, y: number) {
        super(x, y, 0);
    }
}