import {EndEffectorAnimation} from "./EndEffectorAnimation";
import {Vector3D} from "../../Maths/Vector3D";
import {AnimationPrimitiveAPIEntity,} from "../../../../Data/Datasource/API/Entity/Animation/AnimationPrimitiveAPIEntity";
import {fromObject as fromVectorObject} from "../../../../Data/Datasource/API/Entity/Vector3DAPIEntity";
import {BezierToAnimationAPIEntity} from "../../../../Data/Datasource/API/Entity/Animation/Prebuilt/BezierToAnimationAPIEntity";

import MovingOutlinedIcon from '@mui/icons-material/MovingOutlined';

export class BezierToAnimation extends EndEffectorAnimation {
    public readonly endPosition: Vector3D;
    public readonly anchorPoints: Vector3D[];
    
    constructor(relative: boolean, endPosition: Vector3D, anchorPoints: Vector3D[], timeSec: number) {
        super(relative, timeSec);
        this.endPosition = endPosition;
        this.anchorPoints = anchorPoints;
    }

    toApiEntity(): AnimationPrimitiveAPIEntity {
        return {
            anchorPoints: this.anchorPoints.map(fromVectorObject),
            endPosition: fromVectorObject(this.endPosition),
            relative: this.relative,
            timeSec: this.timeSec,
            type: 'Bezier'
        } as BezierToAnimationAPIEntity
    }

    getIcon(): JSX.Element { return <MovingOutlinedIcon />; }

    getName(): string { return "Bezier To Animation"; }
    
    
}