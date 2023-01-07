import {Joint} from "./Joint";
import {Axis3D} from "./Maths/Axis3D";
import {fromObject as fromVector} from "../../Data/Datasource/API/Entity/Vector3DAPIEntity";
import {
    AbsoluteEndEffectorSpecificationAPIEntity
} from "../../Data/Datasource/API/Entity/Specification/AbsoluteEndEffectorSpecificationAPIEntity";
import {Vector3D} from "./Maths/Vector3D";
import {
    RelativeEndEffectorSpecificationAPIEntity
} from "../../Data/Datasource/API/Entity/Specification/RelativeEndEffectorSpecificationAPIEntity";

export class CottusArm {
    public readonly joints: Joint[];
    public readonly nbJoints: number;
    public readonly endEffector: Joint;
    
    constructor(joints: Joint[], nbJoints: number, endEffector: Joint) {
        this.joints = joints;
        this.nbJoints = nbJoints;
        this.endEffector = endEffector;
    }

    /**
     * Rotate the joint of the arm along the following axis by the specified amount
     * @param jointIndex The joint to rotate
     * @param angle The angle by which to rotate the end effector
     */
    public rotateJoint(jointIndex: number, angle: number): void {
        fetch(`/api/arm-controller/angle-diff?joint=${jointIndex}`, {
            method: "POST",
            body: angle as any
        }).then();
    }

    /**
     * Move the end effector along the given axis by the specified amount
     * @param axis The axis along which to move the end effector
     * @param amount The amount by which to move the end effector
     */
    public moveEndEffector(axis: Axis3D, amount: number) {
        if (Number.isNaN(amount)) { return; }
        
        const posDiff: Vector3D = Vector3D.Zero.withCoordinate(axis.id, amount);
        
        fetch('/api/arm-controller/relative-specification', {
            method: "POST",
            body: JSON.stringify({
                root: null,
                armAngle: 0,
                endEffectorPosition: fromVector(posDiff),
                endEffectorRotation: { eulerAngles: fromVector(Vector3D.Zero) }
            } as RelativeEndEffectorSpecificationAPIEntity) as any,
            headers: new Headers({'content-type': 'application/json'})
        }).then();
    }

    /**
     * Rotate the end effector around the given axis by the specified amount
     * @param axis The axis around which to rotate the end effector
     * @param amount The amount by which to rotate the end effector
     */
    rotateEndEffector(axis: Axis3D, deltaAngle: number) {
        if (Number.isNaN(deltaAngle)) { return; }

        const rotDiff: Vector3D = Vector3D.Zero.withCoordinate(axis.id, deltaAngle);

        fetch('/api/arm-controller/relative-specification', {
            method: "POST",
            body: JSON.stringify({
                root: null,
                armAngle: 0,
                endEffectorPosition: fromVector(Vector3D.Zero),
                endEffectorRotation: { eulerAngles: fromVector(rotDiff) }
            } as RelativeEndEffectorSpecificationAPIEntity) as any,
            headers: new Headers({'content-type': 'application/json'})
        }).then();
    }
}