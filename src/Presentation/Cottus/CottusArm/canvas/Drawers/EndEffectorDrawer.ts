import {Vector3D} from "../../../../../Domain/Models/Maths/Vector3D";
import Color from "../../../../Utils/Color";
import {Projection} from "../../../../../Domain/Models/Maths/Projection/Projection";
import {Joint} from "../../../../../Domain/Models/Joint";
import {withLineWidth} from "../../../../Utils/CanvasUtil";

const EndEffectorRadius: number = 0.025;
const DirIndicatorLength: number = 128.0;

function drawEndEffector(
    ctx: CanvasRenderingContext2D,
    projection: Projection,
    endEffector?: Joint,
) {
    if (!endEffector) { return; }
    const { pos, dir } = { pos: endEffector.transform.origin, dir: endEffector.transform.localZ};
    if (pos === undefined || dir === undefined) { return; }
    
    const projPos = projection.project(pos);
    const projDir = projection.project(dir.scale(DirIndicatorLength).plus(pos));

    ctx.fillStyle = Color.Magenta.toRgbString();
    ctx.strokeStyle = Color.Yellow.toRgbString();
    // Draw the articulation itself
    ctx.beginPath();
    ctx.ellipse(
        projPos.x, projPos.y, EndEffectorRadius, EndEffectorRadius,
        0,0, 2*Math.PI);
    ctx.fill();
    
    withLineWidth(8.0, ctx, () => {
        ctx.beginPath();
        ctx.moveTo(projPos.x, projPos.y);
        ctx.lineTo(projDir.x, projDir.y);
        ctx.stroke();
    })
}

export default drawEndEffector;