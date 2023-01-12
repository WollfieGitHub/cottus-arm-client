import {AnimationPrimitiveAPIEntity} from "../../Data/Datasource/API/Entity/Animation/AnimationPrimitiveAPIEntity";
import {AnimationPrimitive} from "../Models/Animation/AnimationPrimitive";
import {AnimationPreview} from "../Models/Animation/AnimationPreview";
import {AnimationEntry} from "../Models/Animation/AnimationEntry";

export default interface AnimationRepository {

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

    /** Save the animation */
    save(name: string, animation: AnimationPrimitive): Promise<boolean>;

    /** Play the animation */
    play(animationName: string): Promise<boolean>
}