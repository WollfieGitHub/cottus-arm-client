import {Joint} from "./Joint";
import {Axis3D} from "./Maths/Axis3D";
import {Vector2D} from "./Maths/Vector2D";

export class CottusArm {
    public readonly joints: Joint[];
    public readonly nbJoints: number;
    
    constructor(joints: Joint[], nbJoints: number) {
        this.joints = joints;
        this.nbJoints = nbJoints;
    }

    /**
     * Rotate the end effector of the arm along the following axis by the specified amount
     * @param axis The axis along which to rotate the end effector around
     * @param angle The angle by which to rotate the end effector
     */
    public rotateEndEffector(axis: Axis3D, angle: number): void {

    }

    /**
     * Move the end effector along the given axis by the specified amount
     * @param axis The axis along which to move the end effector
     * @param amount The amount by which to move the end effector
     */
    public moveEndEffector(axis: Axis3D, amount: number) {
        console.log(amount);
        fetch(`/api/arm-controller/end-effector/rotate?axis=${axis.id}`, {
            method: "POST",
            body: amount as any
        }).then();
    }
}