import {Vector3DAPIEntity} from "./Vector3DAPIEntity";
import {Vector3D} from "../../../../Domain/Models/maths/Vector3D";

export interface TransformAPIEntity {
    origin: Vector3DAPIEntity,
    localX: Vector3DAPIEntity,
    localY: Vector3DAPIEntity,
    localZ: Vector3DAPIEntity,
}