import {AnimationPrimitiveAPIEntity} from "./AnimationPrimitiveAPIEntity";
import {AnimationEntry} from "../../../../../Domain/Models/Animation/AnimationEntry";
import {Circle} from "@mui/icons-material";


export interface AnimationEntryApiEntity {
    animation: AnimationPrimitiveAPIEntity,
    name: string, 
}

export function fromApi(entry: AnimationEntryApiEntity): AnimationEntry {
    return { name: entry.name, animation: { 
        /* TODO */
            toApiEntity(): AnimationPrimitiveAPIEntity { return { type: 'Wait' } },
            timeSec: 0,
            getIcon(): JSX.Element { return <Circle /> },
            getName(): string { return 'TODO' },
        } };
}