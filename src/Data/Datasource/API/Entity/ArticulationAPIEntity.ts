import {Axis3D} from "../../../../Domain/Models/maths/Axis3D";
import {Vector3DAPIEntity} from "./Vector3DAPIEntity";

export interface ArticulationAPIEntity {
    length: number,
    name: string,
    axis: Axis3D,
    parent: ArticulationAPIEntity | null;
    globalPosition: Vector3DAPIEntity,
    localPosition: Vector3DAPIEntity,
    globalRotation: Vector3DAPIEntity,
    localRotation: Vector3DAPIEntity,
    angleRad: number,
}