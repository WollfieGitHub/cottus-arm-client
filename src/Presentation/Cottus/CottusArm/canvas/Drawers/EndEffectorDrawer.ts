import {Vector3D} from "../../../../../Domain/Models/Maths/Vector3D";
import Color from "../../../../Utils/Color";
import {Projection} from "../../../../../Domain/Models/Maths/Projection/Projection";
import {Joint} from "../../../../../Domain/Models/Joint";
import {drawProjectedLine, withLineWidth} from "../../../../Utils/CanvasUtil";

const EndEffectorRadius: number = 0.025;
const DirIndicatorLength: number = 64.0;
const DirIndicatorWidth: number = 4.0;

function drawEndEffector(
    ctx: CanvasRenderingContext2D,
    projection: Projection,
    endEffector?: Joint,
) {
    if (!endEffector) { return; }
    const { pos, dirX, dirY, dirZ } = { 
        pos: endEffector.transform.origin,
        dirX: endEffector.transform.localX,
        dirY: endEffector.transform.localY,
        dirZ: endEffector.transform.localZ
    };
    if ([pos, dirX, dirY, dirZ].some(_ => _ === undefined)) { return; }
    
    const projPos = projection.project(pos);

    ctx.fillStyle = Color.Red.darker().darker().withSaturation(50).toRgbString();
    // Draw the articulation itself
    ctx.beginPath();
    ctx.ellipse(
        projPos.x, projPos.y, EndEffectorRadius, EndEffectorRadius,
        0,0, 2*Math.PI);
    ctx.fill();
    
    withLineWidth(DirIndicatorWidth, ctx, () => {
        drawProjectedLine(ctx, pos, pos.plus(dirX.scale(DirIndicatorLength)), projection, Color.Magenta.brighter(25));
        drawProjectedLine(ctx, pos, pos.plus(dirY.scale(DirIndicatorLength)), projection, Color.Yellow.brighter(25));
        drawProjectedLine(ctx, pos, pos.plus(dirZ.scale(DirIndicatorLength)), projection, Color.Cyan.brighter(25));
    })
}

export default drawEndEffector;