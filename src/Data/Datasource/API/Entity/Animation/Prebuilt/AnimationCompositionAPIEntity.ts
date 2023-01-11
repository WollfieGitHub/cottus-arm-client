import {AnimationPrimitive} from "../../../../../../Domain/Models/Animation/AnimationPrimitive";
import {AnimationPrimitiveAPIEntity} from "../AnimationPrimitiveAPIEntity";

export interface AnimationCompositionAPIEntity extends AnimationPrimitiveAPIEntity {
    animations: AnimationPrimitiveAPIEntity[]
}

