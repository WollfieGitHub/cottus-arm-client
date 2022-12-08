import {Vector3D} from "./Vector3D";

export class Axis3D {
    
    public static readonly X: Axis3D = new Axis3D(new Vector3D(1, 0, 0), 0);
    public static readonly Y: Axis3D = new Axis3D(new Vector3D(0, 1, 0), 1);
    public static readonly Z: Axis3D = new Axis3D(new Vector3D(0, 0, 1), 2);
    
    public readonly unitVector: Vector3D;
    id: number;
    
    constructor(unitVector: Vector3D, id: number) {
        this.unitVector = unitVector;
        this.id = id;
    }
    
}