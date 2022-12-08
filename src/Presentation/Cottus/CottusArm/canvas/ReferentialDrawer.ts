import {OrthographicProjection} from "../../../../Domain/Models/maths/projection/OrthographicProjection";
import {Vector3D} from "../../../../Domain/Models/maths/Vector3D";
import {Axis3D} from "../../../../Domain/Models/maths/Axis3D";
import Color from "../../../utils/Color";
import {Projection} from "../../../../Domain/Models/maths/projection/Projection";

const xGridSpacing: number = 100.0;
const yGridSpacing: number = 100.0;

const xReferentialRange: number = 1000.0;
const yReferentialRange: number = 1000.0;
const zReferentialRange: number = 1000.0;

export function drawReferential(
    ctx: CanvasRenderingContext2D,
    base: Projection
) {
    drawReferentialGrid(ctx, base);
    drawReferentialAxis(ctx, base);
}

function drawReferentialGrid(
    ctx: CanvasRenderingContext2D,
    base: Projection,
) {
    ctx.strokeStyle = new Color(255, 255, 255, 125).toRgbString()
    let gridLineBegin: Vector3D, gridLineEnd: Vector3D;
    // Draw the grid for the x coordinates
    for (let x = 1; x < xReferentialRange/xGridSpacing; x++) {
        [ gridLineBegin, gridLineEnd ] = base.projectAll([
            new Vector3D(+yReferentialRange/2.0, 0, 0)
                .add(new Vector3D(0, xGridSpacing*x - xReferentialRange/2.0, 0)),
            new Vector3D(-yReferentialRange/2.0, 0, 0)
                .add(new Vector3D(0, xGridSpacing*x -xReferentialRange/2.0, 0))
        ]);

        ctx.beginPath();
        ctx.moveTo(gridLineBegin.x, gridLineBegin.y);
        ctx.lineTo(gridLineEnd.x, gridLineEnd.y);
        ctx.stroke();
    }
    // Draw the grid for the y coordinate
    for (let y = 1; y < yReferentialRange/yGridSpacing; y++) {
        [ gridLineBegin, gridLineEnd ] = base.projectAll([
            new Vector3D(0, +xReferentialRange/2.0, 0)
                .add(new Vector3D(xGridSpacing*y-xReferentialRange/2.0, 0, 0)),
            new Vector3D(0, -xReferentialRange/2.0, 0)
                .add(new Vector3D(xGridSpacing*y-xReferentialRange/2.0, 0, 0))
        ]);
        
        ctx.beginPath();
        ctx.moveTo(gridLineBegin.x, gridLineBegin.y);
        ctx.lineTo(gridLineEnd.x, gridLineEnd.y);
        ctx.stroke();
    }
}

function drawReferentialAxis(
    ctx: CanvasRenderingContext2D,
    base: Projection,
) {
    const defaultLineWidth = ctx.lineWidth;
    const drawAxis = (axis: Axis3D, range: number, color: Color, base: Projection) => {
        ctx.strokeStyle = color.toRgbString();

        const [ v0, v1 ] = base.projectAll([
            Vector3D.Zero, axis.unitVector.scale(range)
        ]);
        const { x: x0, y: y0 } = v0;
        const { x: x1, y: y1 } = v1;

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    }
    
    ctx.lineWidth = defaultLineWidth*2;
    drawAxis(Axis3D.X, xReferentialRange/1.9, Color.Red, base);
    drawAxis(Axis3D.Y, yReferentialRange/1.9, Color.Green, base);
    drawAxis(Axis3D.Z, zReferentialRange/1.9, Color.Blue, base);
    ctx.lineWidth = defaultLineWidth;
}