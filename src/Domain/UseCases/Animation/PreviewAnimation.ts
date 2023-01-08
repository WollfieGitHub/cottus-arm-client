import {ArmAnimation} from "../../Models/Animation/ArmAnimation";
import {AnimationPreview} from "../../Models/Animation/AnimationPreview";
import AnimationRepository from "../../Repository/AnimationRepository";

export class AnimationPreviewUseCase {
    id: string = "animation-use-case";

    private readonly animationRepository: AnimationRepository;

    constructor(animationRepository: AnimationRepository) {
        this.animationRepository = animationRepository;
    }

    async invoke(animation: ArmAnimation): Promise<AnimationPreview> {
        return this.animationRepository.preview(animation);
    }
}