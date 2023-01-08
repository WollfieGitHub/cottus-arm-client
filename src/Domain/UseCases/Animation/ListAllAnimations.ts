import AnimationRepository from "../../Repository/AnimationRepository";
import {ArmAnimation} from "../../Models/Animation/ArmAnimation";
import {AnimationPreview} from "../../Models/Animation/AnimationPreview";

export class ListAllAnimationsUseCase {
    id: string = "animation-use-case";

    private readonly animationRepository: AnimationRepository;

    constructor(animationRepository: AnimationRepository) {
        this.animationRepository = animationRepository;
    }

    async invoke(): Promise<ArmAnimation[]> {
        return this.animationRepository.listAll();
    }
}