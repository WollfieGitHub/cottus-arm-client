import {Vector3DAPIEntity} from "../Vector3DAPIEntity";
import {RotationAPIEntity} from "../RotationAPIEntity";

export interface AbsoluteEndEffectorSpecificationAPIEntity {
    armAngle: number,
    endEffectorPosition: Vector3DAPIEntity,
    endEffectorRotation: RotationAPIEntity,
}