import {Joint} from "../../../../../Domain/Models/Joint";
import Color from "../../../../Utils/Color";
import getColorOf from "./JointColorAdapter";
import {Projection} from "../../../../../Domain/Models/Maths/Projection/Projection";
import {CottusArm} from "../../../../../Domain/Models/CottusArm";
import {Vector3D} from "../../../../../Domain/Models/Maths/Vector3D";
import {withLineWidth, withOpacity} from "../../../../Utils/CanvasUtil";
import {Axis3D} from "../../../../../Domain/Models/Maths/Axis3D";
import {Vector2D} from "../../../../../Domain/Models/Maths/Vector2D";

const articulationRadius: number = 0.025;

export function drawArm(
    ctx: CanvasRenderingContext2D,
    arm: CottusArm|undefined,
    base: Projection,
    hovered: string|undefined,
    selected: string|undefined
) {
    if (arm === undefined) { return; }
    
    withLineWidth(16*1.5, ctx, () => {
        arm.joints.forEach(joint => {
            withOpacity(0.5, ctx, () => {
                drawJoint(
                    ctx, joint.name,
                    joint.transform.origin.scaleFrom(new Vector3D(1, 1, 0)),
                    (joint.parent?.transform.origin || Vector3D.Zero).scaleFrom(new Vector3D(1, 1, 0)),
                    Color.greyFrom(50),
                    arm.nbJoints, base, hovered, selected);
            });
            
            // Draw actual joint
            withOpacity(1.0, ctx, () => {
                drawJoint(
                    ctx, joint.name, 
                    joint.transform.origin,
                    joint.parent?.transform.origin || Vector3D.Zero,
                    getColorOf(joint, arm.nbJoints),
                    arm.nbJoints, base, hovered, selected);
            });
        })
    })

}

function drawJoint(
    ctx: CanvasRenderingContext2D,
    jointName: string, jointPos: Vector3D, parentPos: Vector3D,
    color: Color,
    nbJoints: number,
    base: Projection,
    hovered: string|undefined,
    selected: string|undefined
) {
    
    const { x: x0, y: y0 } = base.project(jointPos);
    if (Number.isNaN(x0) || Number.isNaN(y0)) { return; }
    
    if (hovered !== undefined && jointName === hovered) { color = color.brighter(); }
    if (selected !== undefined && jointName === selected) { color = color.darker(40).withSaturation(100); }
    
    ctx.strokeStyle = color.toRgbString();
    ctx.fillStyle = color.toRgbString();
    // Draw the articulation itself
    ctx.beginPath();
    ctx.ellipse(
        x0,  y0, articulationRadius, articulationRadius,
        0,0, 2*Math.PI);
    ctx.fill();
    
    // Draw the joint between two articulations
    const {x: x1, y: y1 } = base.project(parentPos);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}