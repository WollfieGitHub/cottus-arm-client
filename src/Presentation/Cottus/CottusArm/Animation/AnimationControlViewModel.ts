import {useState} from "react";
import {AnimationPrimitive} from "../../../../Domain/Models/Animation/AnimationPrimitive";
import {ListAllAnimationsUseCase} from "../../../../Domain/UseCases/Animation/ListAllAnimations";
import AnimationRepository from "../../../../Domain/Repository/AnimationRepository";
import {AnimationRepositoryImpl} from "../../../../Data/Repository/AnimationRepositoryImpl";
import AnimationDatasourceAPIImpl from "../../../../Data/Datasource/API/AnimationDatasourceAPIImpl";
import {AnimationPreviewUseCase} from "../../../../Domain/UseCases/Animation/PreviewAnimation";
import {AnimationPreview} from "../../../../Domain/Models/Animation/AnimationPreview";
import {AnimationEntry} from "../../../../Domain/Models/Animation/AnimationEntry";
import {AnimationMinTimeUseCase} from "../../../../Domain/UseCases/Animation/GetMinTimeAnimation";

const animationRepository: AnimationRepository = new AnimationRepositoryImpl(new AnimationDatasourceAPIImpl());

const ListAllUseCase = new ListAllAnimationsUseCase(animationRepository);
const PreviewUseCase = new AnimationPreviewUseCase(animationRepository);
const MinTimeUseCase = new AnimationMinTimeUseCase(animationRepository);

export function useAnimationControlViewModel(
    setAnimationPreview: (preview?: AnimationPreview) => void
) {
    
    const [ animations, setAnimations ] = useState<AnimationEntry[]>([]);
    const [ previewMinTime, setPreviewMinTime ] = useState<number|null>(null);
    
    async function getAnimationList(): Promise<void> { setAnimations(await ListAllUseCase.invoke()); }
    
    async function previewAnimation(animation: AnimationPrimitive): Promise<void> {
        setAnimationPreview(await PreviewUseCase.invoke(animation));
        setPreviewMinTime(await MinTimeUseCase.invoke(animation));
    }
    
    function hidePreview() { setAnimationPreview(undefined); }
    
    return {
        animations, getAnimationList, 
        previewAnimation, hidePreview, previewMinTime
    }
}