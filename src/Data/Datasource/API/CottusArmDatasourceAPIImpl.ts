import CottusArmDatasource from "../CottusArmDatasource";
import {CottusArm} from "../../../Domain/Models/CottusArm";
import {CottusArmAPIEntity} from "./Entity/CottusArmAPIEntity";
import {JointAPIEntity} from "./Entity/JointAPIEntity";
import {Joint} from "../../../Domain/Models/Joint";
import {fromApi} from "./Entity/Vector3DAPIEntity";
import WebsocketDatasource from "./WebsocketDatasource";
import {DatasourceObserver} from "../Observer/DatasourceObserver";
import {Transform} from "../../../Domain/Models/Transform";

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
    private arm: CottusArm | undefined;

    constructor() { super("/api/arm-state-socket", true); }
    
    protected onMessageReceived(msg: CottusArmAPIEntity): void {
        const joints: JointAPIEntity[] = msg.joints;
        this.arm = new CottusArm(
            joints.map((j, index) => mapEntity(j, index+1 === joints.length, index)),
            msg.nbJoints,
            mapEntity(joints[joints.length-1], true, joints.length-1)
        );
        
        // @ts-ignore : Complains that the arm can be undefined, which is not the case after the first assignment
        this.subscribers.forEach(subscriber => subscriber.onUpdate(this.arm));
    }

    subscribe(subscriber: DatasourceObserver<CottusArm>): void { this.subscribers.add(subscriber); }
    unsubscribe(subscriber: DatasourceObserver<CottusArm>): void { this.subscribers.delete(subscriber); }
}

function mapEntity(apiEntity: JointAPIEntity, isEndEffector: boolean, index: number): Joint {
    return ({
        length: apiEntity.length,
        name: apiEntity.name,
        parent: mapParent(apiEntity.parent, index-1),
        globalPosition: fromApi(apiEntity.transform.origin),
        angleRad: apiEntity.angleRad,
        transform: ({
            origin: fromApi(apiEntity.transform.origin),
            localX: fromApi(apiEntity.transform.localX),
            localY: fromApi(apiEntity.transform.localY),
            localZ: fromApi(apiEntity.transform.localZ)
        } as Transform),
        isEndEffector: isEndEffector,
        index: index,
    });
}

/** Parent cannot be the end effector anyway */
function mapParent(parent: JointAPIEntity|null, index: number): Joint|null {
    if (parent === null) { return null; }
    else if (parent.virtual) { return mapParent(parent.parent, index); }
    else { return mapEntity(parent, false, index); }
}