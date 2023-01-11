import {
    AnimationPrimitiveAPIEntity, 
} from "../AnimationPrimitiveAPIEntity";
import {
    fromObject as fromVectorObject, fromApi as fromVectorApi,
    Vector3DAPIEntity,
} from "../../Vector3DAPIEntity";
import {LineToAnimation} from "../../../../../../Domain/Models/Animation/Prebuilt/LineToAnimation";

export interface LineToAnimationAPIEntity extends AnimationPrimitiveAPIEntity {
    timeSec: number,
    position: Vector3DAPIEntity,
    relative: boolean,
}
