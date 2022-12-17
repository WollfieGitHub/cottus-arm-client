import CottusArmDatasource from "../CottusArmDatasource";
import {CottusArm} from "../../../Domain/Models/CottusArm";
import {typedFetch} from "../utils/DatasourceUtils";
import {CottusArmAPIEntity} from "./Entity/CottusArmAPIEntity";
import {JointAPIEntity} from "./Entity/JointAPIEntity";
import {Joint} from "../../../Domain/Models/Joint";
import {Vector3D} from "../../../Domain/Models/Maths/Vector3D";
import {Vector3DAPIEntity} from "./Entity/Vector3DAPIEntity";
import WebsocketDatasource from "./WebsocketDatasource";
import {DatasourceObserver} from "../Observer/DatasourceObserver";

/**
 * API Implementation of a datasource for the CottusArm
 * 
 * Its role is to get an instance of the {@link CottusArmAPIEntity} object through
 * the API and then convert it to the model's instance {@link CottusArm} 
 */
export default class CottusArmDatasourceAPIImpl
    extends WebsocketDatasource<CottusArmAPIEntity>
    implements CottusArmDatasource 
{
    private readonly subscribers: Set<DatasourceObserver<CottusArm>> = new Set();
    private arm: CottusArm|undefined;

    constructor() { super("/api/arm-state-socket", true); }
    
    protected onMessageReceived(msg: CottusArmAPIEntity): void {
        console.log(msg);
        this.arm = { joints: msg.joints.filter(j => !j.virtual).map(mapEntity), nbJoints: msg.nbJoints };
        // @ts-ignore : Complains that the arm can be undefined, which is not the case after the first assignment
        this.subscribers.forEach(subscriber => subscriber.onUpdate(this.arm));
    }

    subscribe(subscriber: DatasourceObserver<CottusArm>): void { this.subscribers.add(subscriber); }
    unsubscribe(subscriber: DatasourceObserver<CottusArm>): void { this.subscribers.delete(subscriber); }
}

function mapEntity(apiEntity: JointAPIEntity): Joint {
    return ({
        length: apiEntity.length,
        name: apiEntity.name,
        parent: apiEntity.parent === null ? null : mapEntity(apiEntity.parent),
        globalPosition: mapVector(apiEntity.transform.origin),
        angleRad: apiEntity.angleRad
    });
}

function mapVector(vectorEntity: Vector3DAPIEntity): Vector3D {
    return (new Vector3D(
        vectorEntity.x,
        vectorEntity.y,
        vectorEntity.z,
    ));
}