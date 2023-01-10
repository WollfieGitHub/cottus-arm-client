import {JointAPIEntity} from "./JointAPIEntity";
import {Vector3DAPIEntity} from "./Vector3DAPIEntity";

export interface CottusArmAPIEntity {
    joints: JointAPIEntity[],
    nbJoints: number,
    endEffectorPosition: Vector3DAPIEntity,
    isReady: boolean,
}

export interface CottusArmsAPIEntity {
    simulated: CottusArmAPIEntity,
    driven: CottusArmAPIEntity,
}