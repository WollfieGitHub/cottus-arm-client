import CottusArmDatasource from "../CottusArmDatasource";
import {CottusArm} from "../../../Domain/Models/CottusArm";
import {CottusArmsAPIEntity} from "./Entity/CottusArmsAPIEntity";
import {JointAPIEntity} from "./Entity/JointAPIEntity";
import {Joint} from "../../../Domain/Models/Joint";
import {fromApi} from "./Entity/Vector3DAPIEntity";
import WebsocketDatasource from "./WebsocketDatasource";
import {DatasourceObserver} from "../Observer/DatasourceObserver";
import {Transform} from "../../../Domain/Models/Transform";

/**
 * API Implementation of a datasource for the CottusArm
 * 
 * Its role is to get an instance of the {@link CottusArmsAPIEntity} object through
 * the API and then convert it to the model's instance {@link CottusArm} 
 */
export default class CottusArmDatasourceAPIImpl
    extends WebsocketDatasource<CottusArmsAPIEntity>
    implements CottusArmDatasource 
{
    private readonly subscribers: Set<DatasourceObserver<CottusArm[]>> = new Set();
    private arm: CottusArm | undefined;
    private drivenArm: CottusArm | undefined;

    constructor() { super("/api/arm-state-socket", true); }
    
    protected onMessageReceived(msg: CottusArmsAPIEntity): void {
        const simulatedJoints: JointAPIEntity[] = msg.simulated.joints;
        const drivenJoints: JointAPIEntity[] = msg.driven.joints;
        
        this.arm = new CottusArm(
            simulatedJoints.map((j, index) => mapEntity(j, index+1 === simulatedJoints.length, index)),
            msg.simulated.nbJoints,
            mapEntity(simulatedJoints[simulatedJoints.length-1], true, simulatedJoints.length-1),
            msg.simulated.isReady
        );
        
        this.drivenArm = new CottusArm(
            drivenJoints.map((j, index) => mapEntity(j, index+1 === drivenJoints.length, index)),
            msg.driven.nbJoints,
            mapEntity(drivenJoints[drivenJoints.length-1], true, drivenJoints.length-1),
            msg.driven.isReady
        )
        
        // @ts-ignore : Complains that the arm can be undefined, which is not the case after the first assignment
        this.subscribers.forEach(subscriber => subscriber.onUpdate([this.arm, this.drivenArm]));
    }

    subscribe(subscriber: DatasourceObserver<CottusArm[]>): void { this.subscribers.add(subscriber); }
    unsubscribe(subscriber: DatasourceObserver<CottusArm[]>): void { this.subscribers.delete(subscriber); }
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