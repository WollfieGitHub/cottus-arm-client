import {Vector3D} from "./Vector3D";
import Color from "../../../Presentation/Utils/Color";

export class Axis3D {
    
    public static readonly X: Axis3D = new Axis3D(new Vector3D(1, 0, 0), Color.Red, Color.Magenta.brighter(25), 0);
    public static readonly Y: Axis3D = new Axis3D(new Vector3D(0, 1, 0), Color.Green, Color.Yellow.brighter(25), 1);
    public static readonly Z: Axis3D = new Axis3D(new Vector3D(0, 0, 1), Color.Blue, Color.Cyan.brighter(25), 2);
    
    public readonly unitVector: Vector3D;
    public readonly color: Color;
    public readonly endEffectorColor: Color;
    id: number;
    
    constructor(unitVector: Vector3D, color: Color, endEffectorColor: Color, id: number) {
        this.unitVector = unitVector;
        this.color = color;
        this.endEffectorColor = endEffectorColor;
        this.id = id;
    }
    
}