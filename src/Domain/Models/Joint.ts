import {Axis3D} from "./Maths/Axis3D";
import {Vector3D} from "./Maths/Vector3D";

export interface Joint {
    length: number,
    name: string, 
    parent: Joint | null;
    globalPosition: Vector3D,
    angleRad: number,
}