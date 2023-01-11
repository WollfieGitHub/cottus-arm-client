import {AnimationPreview, AnimationPreviewPoint} from "../../../../../Domain/Models/Animation/AnimationPreview";
import {Projection} from "../../../../../Domain/Models/Maths/Projection/Projection";
import Color from "../../../../Utils/Color";
import {withLineWidth} from "../../../../Utils/CanvasUtil";

const PointRadius: number = 0.01;
const DirectionWidth: number = 4;
const DirectionLength: number = 75;

export function drawAnimationPreview(
    ctx: CanvasRenderingContext2D, animationPreview: AnimationPreview, projection: Projection
) {
    for (const point of animationPreview.points) {
        const color = Color.fromHsl(point.time/animationPreview.duration * 360, 50, 75);
        drawAnimationPreviewPoint(ctx, point, projection, color);
    }
}

function drawAnimationPreviewPoint(
    ctx: CanvasRenderingContext2D, point: AnimationPreviewPoint, projection: Projection, color: Color
) {
    ctx.strokeStyle = color.toRgbString();
    ctx.fillStyle = color.darker().toRgbString();
    
    const [ center, direction ] = projection.projectAll([
        point.position, point.position.plus(point.direction.normalized().scale(DirectionLength))
    ]);
    
    ctx.beginPath();
    ctx.ellipse(center.x, center.y, PointRadius, PointRadius, Math.PI*2, 0, Math.PI*2);
    ctx.fill();

    withLineWidth(DirectionWidth, ctx, () => {
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(direction.x, direction.y);
        ctx.stroke();
    })
    
}