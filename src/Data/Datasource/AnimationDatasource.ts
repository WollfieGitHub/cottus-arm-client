import {ArmAnimationAPIEntity} from "./API/Entity/Animation/ArmAnimationAPIEntity";
import {ArmAnimation} from "../../Domain/Models/Animation/ArmAnimation";
import {AnimationPreview} from "../../Domain/Models/Animation/AnimationPreview";
import {AnimationEntry} from "../../Domain/Models/Animation/AnimationEntry";

export default interface AnimationDatasource {

    /** 
     * The minimum time in seconds the arm will take to go through all the points
     * of the animation
     * @param animation The animation
     */
    getMinTimeSec(animation: ArmAnimation): Promise<number>
    
    /** A list of all stored animations */
    listAll(): Promise<AnimationEntry[]>;
    
    /** A preview of the specified animation */
    preview(animation: ArmAnimation): Promise<AnimationPreview>
    
}