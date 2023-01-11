import {AnimationPrimitiveAPIEntity} from "../AnimationPrimitiveAPIEntity";
import {Vector3DAPIEntity} from "../../Vector3DAPIEntity";

export interface SemiCircleToAnimationAPIEntity extends AnimationPrimitiveAPIEntity {
    relative: boolean,
    endPosition: Vector3DAPIEntity,
    timeSec: number,
    angleDeg: number,
    circleDirection: Vector3DAPIEntity
}