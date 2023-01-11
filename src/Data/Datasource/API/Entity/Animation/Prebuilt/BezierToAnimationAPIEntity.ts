import {AnimationPrimitiveAPIEntity,} from "../AnimationPrimitiveAPIEntity";
import {Vector3DAPIEntity} from "../../Vector3DAPIEntity";

export interface BezierToAnimationAPIEntity extends AnimationPrimitiveAPIEntity {
    timeSec: number,
    anchorPoints: Vector3DAPIEntity[],
    relative: boolean,
    endPosition: Vector3DAPIEntity,
}
