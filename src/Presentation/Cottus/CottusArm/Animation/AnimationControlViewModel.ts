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
import {AnimationSaveUseCase} from "../../../../Domain/UseCases/Animation/SaveAnimation";
import {AnimationPlayUseCase} from "../../../../Domain/UseCases/Animation/PlayAnimation";

const animationRepository: AnimationRepository = new AnimationRepositoryImpl(new AnimationDatasourceAPIImpl());

const ListAllUseCase = new ListAllAnimationsUseCase(animationRepository);
const PreviewUseCase = new AnimationPreviewUseCase(animationRepository);
const MinTimeUseCase = new AnimationMinTimeUseCase(animationRepository);
const SaveUseCase    = new AnimationSaveUseCase(animationRepository);
const PlayUseCase    = new AnimationPlayUseCase(animationRepository);

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
    
    async function saveAnimation(name: string, animation: AnimationPrimitive): Promise<boolean> {
        return await SaveUseCase.invoke(name, animation);
    }
    
    function hidePreview() { setAnimationPreview(undefined); }
    
    async function playAnimation(name: string): Promise<boolean> {
        return await PlayUseCase.invoke(name);
    }
    
    return {
        animations, getAnimationList, 
        previewAnimation, hidePreview, previewMinTime,
        saveAnimation, playAnimation
    }
}