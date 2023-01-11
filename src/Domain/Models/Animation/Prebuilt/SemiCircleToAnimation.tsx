import {EndEffectorAnimation} from "./EndEffectorAnimation";
import {fromObject, Vector3DAPIEntity} from "../../../../Data/Datasource/API/Entity/Vector3DAPIEntity";
import {
    AnimationPrimitiveAPIEntity
} from "../../../../Data/Datasource/API/Entity/Animation/AnimationPrimitiveAPIEntity";
import {
    SemiCircleToAnimationAPIEntity
} from "../../../../Data/Datasource/API/Entity/Animation/Prebuilt/SemiCircleToAnimationAPIEntity";
import {Vector3D} from "../../Maths/Vector3D";
import LooksOutlinedIcon from '@mui/icons-material/LooksOutlined';

export class SemiCircleToAnimation extends EndEffectorAnimation {

    public readonly endPosition: Vector3D;
    public readonly angleDeg: number;
    public  circleDirection: Vector3D;

    constructor(relative: boolean, timeSec: number, endPosition: Vector3D,
                angleDeg: number, circleDirection: Vector3D) {
        super(relative, timeSec);
        this.endPosition = endPosition;
        this.angleDeg = angleDeg;
        this.circleDirection = circleDirection;
    }

    toApiEntity(): AnimationPrimitiveAPIEntity {
        return {
            relative: this.relative,
            timeSec: this.timeSec,
            endPosition: fromObject(this.endPosition),
            circleDirection: fromObject(this.circleDirection),
            angleDeg: this.angleDeg,
            type: 'Semicircle'
        } as SemiCircleToAnimationAPIEntity;
    }

    getIcon(): JSX.Element { return <LooksOutlinedIcon />; }

    getName(): string { return "Semicircle To Animation"; }
    
    
}