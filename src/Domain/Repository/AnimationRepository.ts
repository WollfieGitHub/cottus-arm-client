import {ArmAnimationAPIEntity} from "../../Data/Datasource/API/Entity/Animation/ArmAnimationAPIEntity";
import {ArmAnimation} from "../Models/Animation/ArmAnimation";
import {AnimationPreview} from "../Models/Animation/AnimationPreview";
import {AnimationEntry} from "../Models/Animation/AnimationEntry";

export default interface AnimationRepository {
    
    /** A list of all stored animations */
    listAll(): Promise<AnimationEntry[]>;

    /** A preview of the specified animation */
    preview(animation: ArmAnimation): Promise<AnimationPreview>
    
}