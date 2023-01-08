import {ArmAnimationAPIEntity} from "./API/Entity/Animation/ArmAnimationAPIEntity";
import {ArmAnimation} from "../../Domain/Models/Animation/ArmAnimation";
import {AnimationPreview} from "../../Domain/Models/Animation/AnimationPreview";

export default interface AnimationDatasource {
    
    /** A list of all stored animations */
    listAll(): Promise<ArmAnimationAPIEntity[]>;
    
    /** A preview of the specified animation */
    preview(animation: ArmAnimation): Promise<AnimationPreview>
    
}