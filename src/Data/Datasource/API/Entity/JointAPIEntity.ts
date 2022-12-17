import {TransformAPIEntity} from "./TransformAPIEntity";

export interface JointAPIEntity {
    length: number,
    name: string,
    parent: JointAPIEntity | null;
    angleRad: number,
    transform: TransformAPIEntity,
    virtual: boolean
}