import {Projection} from "../../Domain/Models/maths/projection/Projection";

export default interface CanvasTool {
    
    draw(ctx: CanvasRenderingContext2D, projection: Projection, param: any): void;
}