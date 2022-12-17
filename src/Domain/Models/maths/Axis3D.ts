import {Vector3D} from "./Vector3D";
import Color from "../../../Presentation/utils/Color";

export class Axis3D {
    
    public static readonly X: Axis3D = new Axis3D(new Vector3D(1, 0, 0), Color.Red,0);
    public static readonly Y: Axis3D = new Axis3D(new Vector3D(0, 1, 0), Color.Green, 1);
    public static readonly Z: Axis3D = new Axis3D(new Vector3D(0, 0, 1), Color.Blue, 2);
    
    public readonly unitVector: Vector3D;
    public readonly color: Color;
    id: number;
    
    constructor(unitVector: Vector3D, color: Color, id: number) {
        this.unitVector = unitVector;
        this.color = color;
        this.id = id;
    }
    
}