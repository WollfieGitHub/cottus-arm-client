import {AnimationPrimitiveAPIEntity} from "../../../Data/Datasource/API/Entity/Animation/AnimationPrimitiveAPIEntity";

export abstract class AnimationPrimitive {
    
    public readonly timeSec: number;
    
    protected constructor(timeSec: number) {
        this.timeSec = timeSec;
    }

    abstract toApiEntity(): AnimationPrimitiveAPIEntity;
    
    abstract getIcon(): JSX.Element;
    
    abstract getName(): string;
}