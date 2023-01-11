import {AnimationPrimitive} from "../AnimationPrimitive";
import {
    AnimationPrimitiveAPIEntity
} from "../../../../Data/Datasource/API/Entity/Animation/AnimationPrimitiveAPIEntity";
import {WaitAnimationApiEntity} from "../../../../Data/Datasource/API/Entity/Animation/Prebuilt/WaitAnimationApiEntity";
import {EndEffectorAnimation} from "./EndEffectorAnimation";
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

export class WaitAnimation extends EndEffectorAnimation {
    constructor(timeSec: number) {
        super(true, timeSec);
    }

    toApiEntity(): AnimationPrimitiveAPIEntity {
        return { 
            timeSec: this.timeSec,
            type: 'Wait'
        } as WaitAnimationApiEntity
    }

    getIcon(): JSX.Element { return <AccessTimeOutlinedIcon />; }

    getName(): string { return "Wait Animation"; }
    
}