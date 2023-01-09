import {ArmAnimationAPIEntity, fromApi as fromApiAnimation} from "./ArmAnimationAPIEntity";
import {AnimationEntry} from "../../../../../Domain/Models/Animation/AnimationEntry";


export interface AnimationEntryApiEntity {
    animation: ArmAnimationAPIEntity,
    name: string, 
}

export function fromApi(entry: AnimationEntryApiEntity): AnimationEntry {
    return { name: entry.name, animation: fromApiAnimation(entry.animation) };
}