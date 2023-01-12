import AnimationRepository from "../../Repository/AnimationRepository";
import {AnimationPrimitive} from "../../Models/Animation/AnimationPrimitive";


export class AnimationPlayUseCase {

    id: string = "animation-use-case";

    private readonly animationRepository: AnimationRepository;

    constructor(animationRepository: AnimationRepository) {
        this.animationRepository = animationRepository;
    }

    async invoke(animationName: string): Promise<boolean> {
        return this.animationRepository.play(animationName);
    }
}