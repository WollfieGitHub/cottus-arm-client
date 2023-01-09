import AnimationDatasource from "../AnimationDatasource";
import {ArmAnimationAPIEntity} from "./Entity/Animation/ArmAnimationAPIEntity";
import {typedFetch, typedPost} from "../utils/DatasourceUtils";
import {ArmAnimation} from "../../../Domain/Models/Animation/ArmAnimation";
import {AnimationPreview} from "../../../Domain/Models/Animation/AnimationPreview";
import {
    AnimationPreviewAPIEntity,
    fromApi as fromApiAnimationPreview
} from "./Entity/Animation/AnimationPreviewAPIEntity";
import {AnimationEntry} from "../../../Domain/Models/Animation/AnimationEntry";
import {AnimationEntryApiEntity, fromApi as fromApiEntry} from "./Entity/Animation/AnimationEntryApiEntity";

export default class AnimationDatasourceAPIImpl implements AnimationDatasource {
   
    async listAll(): Promise<AnimationEntry[]> {
        const response = await typedFetch<AnimationEntryApiEntity[]>('/api/arm-animation/list-all');
        const data = await response.json();
        return data.map(datum => fromApiEntry(datum));
    }

    async preview(animation: ArmAnimation): Promise<AnimationPreview> {
        const response = await typedPost<ArmAnimation, AnimationPreviewAPIEntity>(
            `/api/arm-animation/preview`, animation
        )
        const data = await response.json();
        return fromApiAnimationPreview(data);
    }
    
}