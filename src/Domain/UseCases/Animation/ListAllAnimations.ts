import AnimationRepository from "../../Repository/AnimationRepository";
import {AnimationPrimitive} from "../../Models/Animation/AnimationPrimitive";
import {AnimationPreview} from "../../Models/Animation/AnimationPreview";
import {AnimationEntry} from "../../Models/Animation/AnimationEntry";

export class ListAllAnimationsUseCase {
    id: string = "animation-use-case";

    private readonly animationRepository: AnimationRepository;

    constructor(animationRepository: AnimationRepository) {
        this.animationRepository = animationRepository;
    }

    async invoke(): Promise<AnimationEntry[]> {
        return this.animationRepository.listAll();
    }
}