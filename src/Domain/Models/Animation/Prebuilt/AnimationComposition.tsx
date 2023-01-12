import {AnimationPrimitive} from "../AnimationPrimitive";
import {
    AnimationCompositionAPIEntity
} from "../../../../Data/Datasource/API/Entity/Animation/Prebuilt/AnimationCompositionAPIEntity";
import {
    AnimationPrimitiveAPIEntity
} from "../../../../Data/Datasource/API/Entity/Animation/AnimationPrimitiveAPIEntity";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';


function getDuration(animations: AnimationPrimitive[]): number {
    let sum: number = 0;
    for (const animation of animations) { sum += animation.timeSec; }
    return sum;
}

export class AnimationComposition extends AnimationPrimitive {
    
    public readonly animations: AnimationPrimitive[];
    
    constructor(animations: AnimationPrimitive[]) {
        super(getDuration(animations));
        this.animations = animations;
    }

    toApiEntity(): AnimationPrimitiveAPIEntity {
        console.log(this.animations)
        return {
            animations: this.animations.map(a => a.toApiEntity()),
            type: "Composed"
        } as AnimationCompositionAPIEntity;
    }

    getIcon(): JSX.Element { return (<FormatListBulletedIcon />); }

    getName(): string { return "Composition of Animations"; }
    
}