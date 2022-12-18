import {Vector3D} from "../../../../Domain/Models/Maths/Vector3D";

export interface Vector3DAPIEntity {
    x: number, 
    y: number,
    z: number
}

export function fromApi(apiVector: Vector3DAPIEntity): Vector3D {
    return new Vector3D(apiVector.x, apiVector.y, apiVector.z);
}

export function fromObject(vector: Vector3D): Vector3DAPIEntity {
    return { x: vector.x, y: vector.y, z: vector.z};
}