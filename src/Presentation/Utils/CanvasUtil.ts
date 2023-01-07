/** For the scope of the {@code draw} function, the lineWidth property of the ctx will have its
 * width multiplied by the specified widthFactor, and it will be reset to default afterwards
 * @param widthFactor The factor by which to multiply the line width
 * @param ctx The canvas rendering context
 * @param draw The function to invoke with modified line Width
 */
import {Vector2D} from "../../Domain/Models/Maths/Vector2D";
import Color from "./Color";
import {Projection} from "../../Domain/Models/Maths/Projection/Projection";

export const withLineWidth = (widthFactor: number, ctx: CanvasRenderingContext2D, draw: () => void) => {
    const defaultWidth = ctx.lineWidth;
    ctx.lineWidth = defaultWidth*widthFactor;
    
    draw();
    
    ctx.lineWidth = defaultWidth;
};

/**
 * For the scope of the {@code draw} function, the globalAlpha property of the ctx will have its
 * opacity set to the specified opacityFactor, and it will be reset to default afterwards
 * @param opacityFactor The opacity factor to set 
 * @param ctx The canvas rendering context
 * @param draw The function to invoke with modified alpha
 */
export const withOpacity = (opacityFactor: number, ctx: CanvasRenderingContext2D, draw: () => void) => {
    const defaultOpacity = ctx.globalAlpha;
    ctx.globalAlpha = opacityFactor;
    
    draw();
    
    ctx.globalAlpha = defaultOpacity;
}

/**
 * Draw a line with the specified canvas rendering context
 * @param ctx The canvas Rendering context
 * @param x1 First point of the segment
 * @param x2 Second point of the segment
 */
export const drawLine = (ctx: CanvasRenderingContext2D, x1: Vector2D, x2: Vector2D): void => {
    ctx.beginPath();
    ctx.moveTo(x1.x, x1.y);
    ctx.lineTo(x2.x, x2.y);
    ctx.stroke();
}

/**
 * Project the line using the given projection and draw it onto the canvas using the specified canvas rendering context
 * @param ctx The canvas Rendering context
 * @param x1 First point of the segment
 * @param x2 Second point of the segment
 * @param projection The projection to use
 * @param color The color of the line, if left undefined, use the current color of the ctx object
 */
export const drawProjectedLine = (
    ctx: CanvasRenderingContext2D,
    x1: Vector2D, x2: Vector2D, projection: Projection,
    color?: Color
): void => {
    if (color !== undefined) { ctx.strokeStyle = color.toRgbString(); }
    
    const [ p1, p2 ] = projection.projectAll([x1, x2]);
    drawLine(ctx, p1, p2);
}