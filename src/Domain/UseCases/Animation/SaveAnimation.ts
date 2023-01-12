import AnimationRepository from "../../Repository/AnimationRepository";
import {AnimationPrimitive} from "../../Models/Animation/AnimationPrimitive";
import {AnimationPreview} from "../../Models/Animation/AnimationPreview";

export class AnimationSaveUseCase {
    
    id: string = "animation-use-case";

    private readonly animationRepository: AnimationRepository;

    constructor(animationRepository: AnimationRepository) {
        this.animationRepository = animationRepository;
    }

    async invoke(name: string, animation: AnimationPrimitive): Promise<boolean> {
        return this.animationRepository.save(name, animation);
    }
}