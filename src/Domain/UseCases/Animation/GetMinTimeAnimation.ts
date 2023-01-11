import AnimationRepository from "../../Repository/AnimationRepository";
import {AnimationPrimitive} from "../../Models/Animation/AnimationPrimitive";
import {AnimationPreview} from "../../Models/Animation/AnimationPreview";

export class AnimationMinTimeUseCase {
    id: string = "animation-use-case";

    private readonly animationRepository: AnimationRepository;

    constructor(animationRepository: AnimationRepository) {
        this.animationRepository = animationRepository;
    }

    async invoke(animation: AnimationPrimitive): Promise<number> {
        return this.animationRepository.getMinTimeSec(animation);
    }
}