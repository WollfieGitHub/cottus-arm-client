import {Joint} from "./Joint";
import {Axis3D} from "./Maths/Axis3D";
import {Vector2D} from "./Maths/Vector2D";
import {Vector3D} from "./Maths/Vector3D";

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
        
    }
}