import {OrthographicProjection} from "../../../../../Domain/Models/Maths/projection/OrthographicProjection";
import {Vector3D} from "../../../../../Domain/Models/Maths/Vector3D";
import {Axis3D} from "../../../../../Domain/Models/Maths/Axis3D";
import Color from "../../../../utils/Color";
import {Projection} from "../../../../../Domain/Models/Maths/projection/Projection";

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
    const drawAxis = (axis: Axis3D, range: number, base: Projection) => {
        ctx.strokeStyle = axis.color.toRgbString();

        const [ v0, v1 ] = base.projectAll([
            Vector3D.Zero, axis.unitVector.scale(range)
        ]);

        ctx.beginPath();
        ctx.moveTo(v0.x, v0.y);
        ctx.lineTo(v1.x, v1.y);
        ctx.stroke();
    }
    
    ctx.lineWidth = defaultLineWidth*8;
    drawAxis(Axis3D.X, xReferentialRange/1.9, base);
    drawAxis(Axis3D.Y, yReferentialRange/1.9, base);
    drawAxis(Axis3D.Z, zReferentialRange/1.9, base);
    
    ctx.lineWidth = defaultLineWidth;
}