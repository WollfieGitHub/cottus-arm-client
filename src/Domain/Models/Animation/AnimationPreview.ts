import {Vector3DAPIEntity} from "../../../Data/Datasource/API/Entity/Vector3DAPIEntity";
import {Vector3D} from "../Maths/Vector3D";

/**
 * On hover of an animation, show a curve of the animation with sampled points. The hue of the color color
 * of the points goes from 0 to 360. 0 when the time is 0 and 360 is totalDuration. So
 * that we can also see waiting points
 */
export interface AnimationPreview {
    points: AnimationPreviewPoint[],
    duration: number,
}

export interface AnimationPreviewPoint {
    position: Vector3D,
    direction: Vector3D, // Pointing towards the end effector's local Z
    time: number,
}

