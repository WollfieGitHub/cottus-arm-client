import {Vector3DAPIEntity} from "./Vector3DAPIEntity";

export interface TransformAPIEntity {
    origin: Vector3DAPIEntity,
    localX: Vector3DAPIEntity,
    localY: Vector3DAPIEntity,
    localZ: Vector3DAPIEntity,
}