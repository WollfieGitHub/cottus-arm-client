import {Joint} from "./Joint";

export class CottusArmInfo {
    public static readonly NumberOfArticulations = 7;
}

export interface CottusArm {
    joints: Joint[],
    nbJoints: number,
}