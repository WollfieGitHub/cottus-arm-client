/** For the scope of the {@code draw} function, the lineWidth property of the ctx will have its
 * width multiplied by the specified widthFactor, and it will be reset to default afterwards
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