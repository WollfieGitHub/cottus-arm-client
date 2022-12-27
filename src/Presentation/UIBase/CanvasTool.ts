import {Projection} from "../../Domain/Models/Maths/Projection/Projection";

export default interface CanvasTool {
    
    draw(ctx: CanvasRenderingContext2D, projection: Projection, param: any): void;
}