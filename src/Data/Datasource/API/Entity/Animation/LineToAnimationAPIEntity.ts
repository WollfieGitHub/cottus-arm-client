import {
    ArmAnimationAPIEntity,
    fromObject as fromAnim,
} from "./ArmAnimationAPIEntity";
import {
    Vector3DAPIEntity,
    
    fromObject as fromVector,
} from "../Vector3DAPIEntity";
import {LineToAnimation} from "../../../../../Domain/Models/Animation/LineToAnimation";

export interface LineToAnimationAPIEntity extends ArmAnimationAPIEntity {
    position: Vector3DAPIEntity,
    relative: boolean, 
}

export function fromObject(anim: LineToAnimation): LineToAnimationAPIEntity {
    return {
        position: fromVector(anim.position),
        relative: anim.relative,
        ...fromAnim(anim)
    }
}