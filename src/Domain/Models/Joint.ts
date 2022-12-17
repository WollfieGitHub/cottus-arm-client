import {Axis3D} from "./maths/Axis3D";
import {Vector3D} from "./maths/Vector3D";

export interface Joint {
    length: number,
    name: string, 
    parent: Joint | null;
    globalPosition: Vector3D,
    angleRad: number,
}