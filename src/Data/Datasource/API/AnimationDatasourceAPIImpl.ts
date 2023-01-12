import AnimationDatasource from "../AnimationDatasource";
import {AnimationPrimitiveAPIEntity} from "./Entity/Animation/AnimationPrimitiveAPIEntity";
import {typedFetch, typedPost} from "../utils/DatasourceUtils";
import {AnimationPrimitive} from "../../../Domain/Models/Animation/AnimationPrimitive";
import {AnimationPreview} from "../../../Domain/Models/Animation/AnimationPreview";
import {
    AnimationPreviewAPIEntity,
    fromApi as fromApiAnimationPreview
} from "./Entity/Animation/AnimationPreviewAPIEntity";
import {AnimationEntry} from "../../../Domain/Models/Animation/AnimationEntry";
import {AnimationEntryApiEntity, fromApi as fromApiEntry} from "./Entity/Animation/AnimationEntryApiEntity";

export default class AnimationDatasourceAPIImpl implements AnimationDatasource {
    
    async save(name: string, animation: AnimationPrimitive): Promise<boolean> {
        const response = await typedPost<AnimationPrimitiveAPIEntity, boolean>(
            `/api/arm-animation/save?name=${name}`, animation.toApiEntity()
        );
        return await response.json().catch(e => false);
    }
   
    async listAll(): Promise<AnimationEntry[]> {
        const response = await typedFetch<AnimationEntryApiEntity[]>('/api/arm-animation/list-all');
        console.log(response, typeof response);
        const data = await response.json();
        return data.map(datum => fromApiEntry(datum));
    }

    async preview(animation: AnimationPrimitive): Promise<AnimationPreview> {
        const response = await typedPost<AnimationPrimitiveAPIEntity, AnimationPreviewAPIEntity>(
            `/api/arm-animation/preview?nb_points=${20}`, animation.toApiEntity()
        )
        const data = await response.json();
        return fromApiAnimationPreview(data);
    }

    async getMinTimeSec(animation: AnimationPrimitive): Promise<number> {
        const response = await typedPost<AnimationPrimitiveAPIEntity, number>(
            `/api/arm-animation/min-time?nb_points=${20}`, animation.toApiEntity()
        )
        const data = await response.text();
        return parseFloat(data);
    }
    
    async play(animationName: string): Promise<boolean> {
        const response = await typedPost<void, boolean>(
            `/api/arm-animation/play?name=${animationName}`, undefined
        );
        return await response.json().catch(e => false);
    }
    
}