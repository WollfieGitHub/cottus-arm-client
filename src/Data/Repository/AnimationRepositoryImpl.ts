import AnimationRepository from "../../Domain/Repository/AnimationRepository";
import AnimationDatasource from "../Datasource/AnimationDatasource";
import {AnimationPrimitiveAPIEntity} from "../Datasource/API/Entity/Animation/AnimationPrimitiveAPIEntity";
import {AnimationPrimitive} from "../../Domain/Models/Animation/AnimationPrimitive";
import {AnimationPreview} from "../../Domain/Models/Animation/AnimationPreview";
import {AnimationEntry} from "../../Domain/Models/Animation/AnimationEntry";

export class AnimationRepositoryImpl implements AnimationRepository {
    id: string = "animation-repository-impl"

    private readonly datasource: AnimationDatasource;

    constructor(datasource: AnimationDatasource) {
        this.datasource = datasource;
    }

    async listAll(): Promise<AnimationEntry[]> {
        return this.datasource.listAll();
    }

    async preview(animation: AnimationPrimitive): Promise<AnimationPreview> {
        return this.datasource.preview(animation);
    }

    async getMinTimeSec(animation: AnimationPrimitive): Promise<number> {
        return this.datasource.getMinTimeSec(animation);
    }
    
    
    

    
}