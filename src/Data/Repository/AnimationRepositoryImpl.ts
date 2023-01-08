import AnimationRepository from "../../Domain/Repository/AnimationRepository";
import AnimationDatasource from "../Datasource/AnimationDatasource";
import {ArmAnimationAPIEntity} from "../Datasource/API/Entity/Animation/ArmAnimationAPIEntity";
import {ArmAnimation} from "../../Domain/Models/Animation/ArmAnimation";
import {AnimationPreview} from "../../Domain/Models/Animation/AnimationPreview";

export class AnimationRepositoryImpl implements AnimationRepository {
    id: string = "animation-repository-impl"

    private readonly datasource: AnimationDatasource;

    constructor(datasource: AnimationDatasource) {
        this.datasource = datasource;
    }

    async listAll(): Promise<ArmAnimationAPIEntity[]> {
        return this.datasource.listAll();
    }

    async preview(animation: ArmAnimation): Promise<AnimationPreview> {
        return this.datasource.preview(animation);
    }

    
}