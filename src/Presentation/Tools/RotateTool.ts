import {Joint} from "../../Domain/Models/Joint";
import {CottusArm} from "../../Domain/Models/CottusArm";
import {Projection} from "../../Domain/Models/Maths/Projection/Projection";
import {withLineWidth} from "../Utils/CanvasUtil";
import {Axis3D} from "../../Domain/Models/Maths/Axis3D";
import Color from "../Utils/Color";
import {Vector3D} from "../../Domain/Models/Maths/Vector3D";
import {ControlTool} from "./ControlTool";
import DistanceEquation from "../../Domain/Models/Maths/DistanceEquation";
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
        
        const drawAxis = (axis: Axis3D, centerPos: Vector3D) => {
            withLineWidth(this.hovered||this.selected
                ? ControlTool.selectedWidth
                : ControlTool.defaultWidth, ctx, () => {
                ctx.strokeStyle = axis.color.toRgbString();

                const { v0, v1 } = axis.unitVector.planeFromNormal();

                const ell: Ellipse = projection.projectEllipse(
                    centerPos,
                    centerPos.add(v0.normalized().scale(rotateToolSize)),
                    centerPos.add(v1.normalized().scale(rotateToolSize)),
                );
                this.selectionEquation = DistanceEquation.fromEllipse(ell);
                
                ctx.beginPath();
                ctx.ellipse(ell.center.x, ell.center.y, ell.radiusX, ell.radiusY, ell.rotation, 0, 2*Math.PI);
                ctx.stroke();
            });
        }

        drawAxis(this.axis, joint.globalPosition);
    }
    
    protected onToolUpdate(arm: CottusArm): void {
        
    }
}