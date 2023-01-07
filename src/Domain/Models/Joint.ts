import {Vector3D} from "./Maths/Vector3D";
import {Transform} from "./Transform";

export interface Joint {
    length: number,
    name: string, 
    parent: Joint | null;
    globalPosition: Vector3D,
    angleRad: number,
    transform: Transform,
    isEndEffector: boolean,
    index: number
}