import {CottusArmRepository} from "../../Domain/Repository/CottusArmRepository";
import CottusArmDatasource from "../Datasource/CottusArmDatasource";
import {CottusArm} from "../../Domain/Models/CottusArm";
import {DatasourceObserver} from "../Datasource/Observer/DatasourceObserver";
import {RepositoryObserver} from "../../Domain/Repository/Observer/RepositoryObserver";

export class CottusArmRepositoryImpl implements CottusArmRepository, DatasourceObserver<CottusArm> {
    id: string = "cottus-arm-repository-impl"
    
    private readonly subscribers: Set<RepositoryObserver<CottusArm>> = new Set();
    private readonly datasource: CottusArmDatasource;
    
    constructor(datasource: CottusArmDatasource) {
        this.datasource = datasource;
        this.datasource.subscribe(this);
    }
    
    onUpdate(data: CottusArm) { this.subscribers.forEach(subscriber => subscriber.onUpdate(data)); }

    subscribe(subscriber: DatasourceObserver<CottusArm>): void { this.subscribers.add(subscriber); }
    unsubscribe(subscriber: DatasourceObserver<CottusArm>): void { this.subscribers.delete(subscriber); }
}