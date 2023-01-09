import {ArmAnimation} from "../../../../../Domain/Models/Animation/ArmAnimation";

export interface ArmAnimationAPIEntity {
    time: number,
}

export function fromApi(anim: ArmAnimationAPIEntity): ArmAnimation {
    return { time: anim.time };
}