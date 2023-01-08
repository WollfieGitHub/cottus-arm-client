import AnimationDatasource from "../AnimationDatasource";
import {ArmAnimationAPIEntity, fromApi as fromApiAnimation} from "./Entity/Animation/ArmAnimationAPIEntity";
import {typedFetch} from "../utils/DatasourceUtils";
import {ArmAnimation} from "../../../Domain/Models/Animation/ArmAnimation";
import {AnimationPreview} from "../../../Domain/Models/Animation/AnimationPreview";
import {
    AnimationPreviewAPIEntity,
    fromApi as fromApiAnimationPreview
} from "./Entity/Animation/AnimationPreviewAPIEntity";

export default class AnimationDatasourceAPIImpl implements AnimationDatasource {
   
    async listAll(): Promise<ArmAnimation[]> {
        const response = await typedFetch<ArmAnimationAPIEntity[]>('/api/arm-animation/list-all');
        const data = await response.json();
        return data.map(datum => fromApiAnimation(datum));
    }

    async preview(animation: ArmAnimation): Promise<AnimationPreview> {
        const response = await typedFetch<AnimationPreviewAPIEntity>(
            `/api/arm-animation/preview?animation_name=${animation.name}`
        );
        const data = await response.json();
        return fromApiAnimationPreview(data);
    }
    
}