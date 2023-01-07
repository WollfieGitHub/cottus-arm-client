import {Vector3DAPIEntity} from "../Vector3DAPIEntity";
import {RotationAPIEntity} from "../RotationAPIEntity";
import {AbsoluteEndEffectorSpecificationAPIEntity} from "./AbsoluteEndEffectorSpecificationAPIEntity";

export interface RelativeEndEffectorSpecificationAPIEntity {
    root: AbsoluteEndEffectorSpecificationAPIEntity|null,
    armAngle: number,
    endEffectorPosition: Vector3DAPIEntity,
    endEffectorRotation: RotationAPIEntity,
}