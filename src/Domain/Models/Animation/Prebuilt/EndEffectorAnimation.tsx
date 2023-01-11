import {AnimationPrimitive} from "../AnimationPrimitive";

export abstract class EndEffectorAnimation extends AnimationPrimitive {
   
    public readonly relative: boolean;

    protected constructor(relative: boolean, timeSec: number) {
        super(timeSec);
        this.relative = relative;
    }
}