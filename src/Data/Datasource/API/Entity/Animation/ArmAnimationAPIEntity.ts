import {ArmAnimation} from "../../../../../Domain/Models/Animation/ArmAnimation";

export interface ArmAnimationAPIEntity {
    time: number,
}

export function fromObject(anim: ArmAnimationAPIEntity): ArmAnimation {
    return { time: anim.time };
}