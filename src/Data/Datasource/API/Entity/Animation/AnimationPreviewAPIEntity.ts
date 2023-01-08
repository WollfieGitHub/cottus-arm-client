import {Vector3DAPIEntity} from "../Vector3DAPIEntity";

/**
 * On hover of an animation, show a curve of the animation with sampled points. The hue of the color color
 * of the points goes from 0 to 360. 0 when the time is 0 and 360 is totalDuration. So
 * that we can also see waiting points
 */
export interface AnimationPreviewAPIEntity {
    points: AnimationPreviewPointAPIEntity[],
    duration: number,
}

export interface AnimationPreviewPointAPIEntity {
    position: Vector3DAPIEntity,
    direction: Vector3DAPIEntity, // Pointing towards the end effector's local Z
    time: number,
}