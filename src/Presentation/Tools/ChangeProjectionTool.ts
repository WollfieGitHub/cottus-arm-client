import {Projection, ProjectionType} from "../../Domain/Models/Maths/Projection/Projection";
import CanvasTool from "../UIBase/CanvasTool";
import {ClickableCanvasButton, OnClick} from "../UIBase/ClickableCanvasButton";
import {Rect} from "../../Domain/Models/Maths/Shapes/Rect";
import {Vector2D} from "../../Domain/Models/Maths/Vector2D";

export default class ChangeProjectionTool extends ClickableCanvasButton implements CanvasTool {
    
    private static readonly width: number = 0.1;
    private static readonly height: number = 0.1;
    private static readonly posX: number = 0.75;
    private static readonly posY: number = 0.75;
    
    draw(ctx: CanvasRenderingContext2D, projection: Projection, type: ProjectionType): void {
        
    }

    getBoundingBox(): Rect {
        return new Rect(
            new Vector2D(ChangeProjectionTool.posX, ChangeProjectionTool.posY),
            new Vector2D(ChangeProjectionTool.width, ChangeProjectionTool.height),
        );
    }
    
}