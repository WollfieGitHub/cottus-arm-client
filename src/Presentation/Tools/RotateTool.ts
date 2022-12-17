import {Joint} from "../../Domain/Models/Joint";
import {CottusArm} from "../../Domain/Models/CottusArm";
import {Projection} from "../../Domain/Models/Maths/projection/Projection";
import {withLineWidth} from "../utils/CanvasUtil";
import {Axis3D} from "../../Domain/Models/Maths/Axis3D";
import Color from "../utils/Color";
import {Vector3D} from "../../Domain/Models/Maths/Vector3D";
import {ControlTool} from "./ControlTool";
import SFVector2DEquation from "../../Domain/Models/Maths/SFVector2DEquation";
import {Ellipse} from "../../Domain/Models/Maths/Shapes/Ellipse";

const rotateToolSize = 100;

export default class RotateTool extends ControlTool{
    
    private readonly size: number;
    private readonly axis: Axis3D;
    
    constructor(size: number, axis: Axis3D) {
        super();
        this.size = size;
        this.axis = axis;
    }

    selectionEquation: SFVector2DEquation | undefined;

    draw(
        ctx: CanvasRenderingContext2D,
        projection: Projection,
        joint: Joint|undefined
    ) {
        if (joint === undefined) {
            this.selectionEquation = undefined;
            return;
        }
        
        const drawAxis = (axis: Axis3D, centerPos: Vector3D) => {
            withLineWidth(this.hovered||this.selected ? 6.0 : 3.0, ctx, () => {
                ctx.strokeStyle = axis.color.toRgbString();

                const { v0, v1 } = axis.unitVector.planeFromNormal();

                const ell: Ellipse = projection.projectEllipse(
                    centerPos,
                    centerPos.add(v0.normalized().scale(rotateToolSize)),
                    centerPos.add(v1.normalized().scale(rotateToolSize)),
                );
                this.selectionEquation = SFVector2DEquation.fromEllipse(ell);
                
                ctx.beginPath();
                ctx.ellipse(ell.center.x, ell.center.y, ell.radiusX, ell.radiusY, ell.rotation, 0, 2*Math.PI);
                ctx.stroke();
            });
        }

        drawAxis(this.axis, joint.globalPosition);
    }
}