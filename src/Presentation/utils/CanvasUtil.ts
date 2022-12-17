/** For the scope of the {@code draw} function, the lineWidth property of the ctx will have its
 * width multiplied by the specified widthFactor and it will be reset to default afterwards
 * @param widthFactor The factor by which to multiply the line width
 * @param ctx The canvas rendering context
 * @param draw The function to invoke with modified line Width
 */
export const withLineWidth = (widthFactor: number, ctx: CanvasRenderingContext2D, draw: () => void) => {
    const defaultWidth = ctx.lineWidth;
    ctx.lineWidth = defaultWidth*widthFactor;
    
    draw();
    
    ctx.lineWidth = defaultWidth;
};
