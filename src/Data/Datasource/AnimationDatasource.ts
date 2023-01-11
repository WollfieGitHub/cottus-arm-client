import {AnimationPrimitiveAPIEntity} from "./API/Entity/Animation/AnimationPrimitiveAPIEntity";
import {AnimationPrimitive} from "../../Domain/Models/Animation/AnimationPrimitive";
import {AnimationPreview} from "../../Domain/Models/Animation/AnimationPreview";
import {AnimationEntry} from "../../Domain/Models/Animation/AnimationEntry";

export default interface AnimationDatasource {

    /** 
     * The minimum time in seconds the arm will take to go through all the points
     * of the animation
     * @param animation The animation
     */
    getMinTimeSec(animation: AnimationPrimitive): Promise<number>
    
    /** A list of all stored animations */
    listAll(): Promise<AnimationEntry[]>;
    
    /** A preview of the specified animation */
    preview(animation: AnimationPrimitive): Promise<AnimationPreview>
    
}