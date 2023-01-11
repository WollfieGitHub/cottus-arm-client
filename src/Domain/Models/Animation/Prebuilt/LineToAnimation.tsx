import {Vector3D} from "../../Maths/Vector3D";
import {EndEffectorAnimation} from "./EndEffectorAnimation";
import {AnimationPrimitiveAPIEntity} from "../../../../Data/Datasource/API/Entity/Animation/AnimationPrimitiveAPIEntity";
import {fromObject as fromVectorObject} from "../../../../Data/Datasource/API/Entity/Vector3DAPIEntity";
import {LineToAnimationAPIEntity} from "../../../../Data/Datasource/API/Entity/Animation/Prebuilt/LineToAnimationAPIEntity";
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';

export class LineToAnimation extends EndEffectorAnimation{
    public readonly position: Vector3D;
    
    constructor(relative: boolean, position: Vector3D, timeSec: number) {
        super(relative, timeSec);
        this.position = position;
    }

    toApiEntity(): AnimationPrimitiveAPIEntity {
        return {
            position: fromVectorObject(this.position),
            relative: this.relative,
            timeSec: this.timeSec,
            type: 'Line'
        } as LineToAnimationAPIEntity
    }

    getIcon(): JSX.Element { return <TimelineRoundedIcon />; }

    getName(): string { return "Line To Animation"; }
}