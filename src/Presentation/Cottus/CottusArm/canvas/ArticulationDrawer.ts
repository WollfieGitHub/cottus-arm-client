import {Articulation} from "../../../../Domain/Models/Articulation";
import Color from "../../../utils/Color";
import getColorOf from "./ArticulationColorAdapter";
import {Projection} from "../../../../Domain/Models/maths/projection/Projection";
import {CottusArm} from "../../../../Domain/Models/CottusArm";

const articulationRadius: number = 2.0;

export function drawArm(
    ctx: CanvasRenderingContext2D,
    arm: CottusArm,
    base: Projection
) {
    arm.articulations.forEach(articulation => {
        drawArticulation(ctx, articulation, base);
    })
}

function drawArticulation(
    ctx: CanvasRenderingContext2D,
    articulation: Articulation,
    base: Projection,
) {
    const color: Color = getColorOf(articulation);
    ctx.strokeStyle = color.darker().toRgbString();
    ctx.fillStyle = color.toRgbString();
    
    const { x: x0, y: y0 } = base.project(articulation.globalPosition);
    
    // Draw the articulation itself
    ctx.beginPath();
    ctx.ellipse(
        x0,  y0,
        articulationRadius, articulationRadius,
        0,0, 2*Math.PI
    );
    ctx.fill();
    
    if (articulation.parent === null) { return; }
    // Draw the joint between two articulations
    const {x: x1, y: y1 } = base.project(articulation.parent.globalPosition);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}