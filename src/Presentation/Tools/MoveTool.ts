import {CottusArm} from "../../Domain/Models/CottusArm";
import {Joint} from "../../Domain/Models/Joint";
import {Vector3D} from "../../Domain/Models/Maths/Vector3D";
import {Axis3D} from "../../Domain/Models/Maths/Axis3D";
import {Projection} from "../../Domain/Models/Maths/projection/Projection";
import Color from "../utils/Color";
import {withLineWidth} from "../utils/CanvasUtil";
import {ControlTool} from "./ControlTool";
import DistanceEquation from "../../Domain/Models/Maths/DistanceEquation";


export default class MoveTool extends ControlTool {
    
    private readonly size: number;
    private readonly axis: Axis3D;
    
    constructor(size: number, axis: Axis3D) {
        super();
        this.size = size;
        this.axis = axis;
    }

    selectionEquation: DistanceEquation | undefined;

    draw(
        ctx: CanvasRenderingContext2D,
        projection: Projection,
        joint: Joint|undefined
    ) {
        if (joint === undefined) { 
            this.selectionEquation = undefined;
            return; 
        }

        const drawAxis = (axis: Axis3D, origin: Vector3D) => {
            ctx.strokeStyle = axis.color.toRgbString();

            const [p0, p1] = projection.projectAll([
                origin, origin.add(axis.unitVector.scale(this.size))
            ])
            this.selectionEquation = DistanceEquation.fromSeg(p0, p1);

            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
        }

        withLineWidth(this.hovered||this.selected
                ? ControlTool.selectedWidth 
                : ControlTool.defaultWidth, ctx, () => {
            drawAxis(this.axis, joint.globalPosition);
        })

    }
}