import {Joint} from "../../../../../Domain/Models/Joint";
import Color from "../../../../utils/Color";
import getColorOf from "./JointColorAdapter";
import {Projection} from "../../../../../Domain/Models/Maths/projection/Projection";
import {CottusArm} from "../../../../../Domain/Models/CottusArm";
import {Vector3D} from "../../../../../Domain/Models/Maths/Vector3D";
import {withLineWidth} from "../../../../utils/CanvasUtil";
import {Axis3D} from "../../../../../Domain/Models/Maths/Axis3D";

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
        arm.joints.forEach(joint => { drawJoint(ctx, joint, arm.nbJoints, base, hovered, selected); })
    })

}

function drawJoint(
    ctx: CanvasRenderingContext2D,
    joint: Joint,
    nbJoints: number,
    base: Projection,
    hovered: string|undefined,
    selected: string|undefined
) {
    
    const { x: x0, y: y0 } = base.project(joint.globalPosition);
    if (Number.isNaN(x0) || Number.isNaN(y0)) { return; }

    let color: Color = getColorOf(joint, nbJoints);
    
    if (hovered !== undefined && joint.name === hovered) { color = color.brighter(); }
    if (selected !== undefined && joint.name === selected) { color = color.darker(40).withSaturation(100); }
    
    ctx.strokeStyle = color.toRgbString();
    ctx.fillStyle = color.toRgbString();
    // Draw the articulation itself
    ctx.beginPath();
    ctx.ellipse(
        x0,  y0,
        articulationRadius, articulationRadius,
        0,0, 2*Math.PI
    );
    ctx.fill();

    let parentPos: Vector3D;
    if (joint.parent === null) { parentPos = Vector3D.Zero; }
    else { parentPos = joint.parent.globalPosition; }
    
    // Draw the joint between two articulations
    const {x: x1, y: y1 } = base.project(parentPos);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}