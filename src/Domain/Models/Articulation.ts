import {Axis3D} from "./maths/Axis3D";
import {Vector3D} from "./maths/Vector3D";

export interface Articulation {
    length: number,
    name: string, 
    axis: Axis3D,
    parent: Articulation | null;
    globalPosition: Vector3D,
    localPosition: Vector3D,
    globalRotation: Vector3D,
    localRotation: Vector3D,
    angleRad: number,
}