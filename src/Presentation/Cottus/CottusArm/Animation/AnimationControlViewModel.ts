import {useState} from "react";
import {ArmAnimation} from "../../../../Domain/Models/Animation/ArmAnimation";
import {ListAllAnimationsUseCase} from "../../../../Domain/UseCases/Animation/ListAllAnimations";
import AnimationRepository from "../../../../Domain/Repository/AnimationRepository";
import {AnimationRepositoryImpl} from "../../../../Data/Repository/AnimationRepositoryImpl";
import AnimationDatasourceAPIImpl from "../../../../Data/Datasource/API/AnimationDatasourceAPIImpl";
import {AnimationPreviewUseCase} from "../../../../Domain/UseCases/Animation/PreviewAnimation";
import {AnimationPreview} from "../../../../Domain/Models/Animation/AnimationPreview";

const animationRepository: AnimationRepository = new AnimationRepositoryImpl(new AnimationDatasourceAPIImpl());

const ListAllUseCase = new ListAllAnimationsUseCase(animationRepository);
const PreviewUseCase = new AnimationPreviewUseCase(animationRepository);

export function useViewModel() {
    
    const [ animations, setAnimations ] = useState<ArmAnimation[]>([]);
    const [ currentPreview, setCurrentPreview ] = useState<AnimationPreview|null>(null);
    
    async function getAnimationList(): Promise<void> { setAnimations(await ListAllUseCase.invoke()); }
    
    async function previewAnimation(animation: ArmAnimation): Promise<void> { 
        setCurrentPreview(await PreviewUseCase.invoke(animation));
    }
    
    function hidePreview() { setCurrentPreview(null); }
    
    return {
        animations, getAnimationList, 
        currentPreview, previewAnimation, hidePreview
    }
}