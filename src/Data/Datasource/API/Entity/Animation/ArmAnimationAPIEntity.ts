import {ArmAnimation} from "../../../../../Domain/Models/Animation/ArmAnimation";

export interface ArmAnimationAPIEntity {
    time: number,
    name: string
}

export function fromApi(anim: ArmAnimationAPIEntity): ArmAnimation {
    return { time: anim.time, name: anim.name };
}