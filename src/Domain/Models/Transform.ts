import {Vector3D} from "./Maths/Vector3D";

export interface Transform {
    origin: Vector3D,
    localX: Vector3D,
    localY: Vector3D,
    localZ: Vector3D,
}