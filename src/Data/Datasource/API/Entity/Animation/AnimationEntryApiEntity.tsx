import {AnimationPrimitiveAPIEntity} from "./AnimationPrimitiveAPIEntity";
import {AnimationEntry} from "../../../../../Domain/Models/Animation/AnimationEntry";
import {Circle} from "@mui/icons-material";
import {fromApi as fromApiAnimation} from "./AnimationPrimitiveAPIEntity";


export interface AnimationEntryApiEntity {
    animation: AnimationPrimitiveAPIEntity,
    name: string, 
}

export function fromApi(entry: AnimationEntryApiEntity): AnimationEntry {
    return { name: entry.name, animation: fromApiAnimation(entry.animation)};
}