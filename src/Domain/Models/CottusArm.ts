import {Articulation} from "./Articulation";

export class CottusArmInfo {
    public static readonly NumberOfArticulations = 7;
}

export interface CottusArm {
    articulations: Articulation[]
}