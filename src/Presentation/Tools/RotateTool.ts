import {Joint} from "../../Domain/Models/Joint";
import {CottusArm} from "../../Domain/Models/CottusArm";
import {Projection} from "../../Domain/Models/Maths/Projection/Projection";
import {withLineWidth} from "../Utils/CanvasUtil";
import {Axis3D} from "../../Domain/Models/Maths/Axis3D";
import Color from "../Utils/Color";
import {Vector3D} from "../../Domain/Models/Maths/Vector3D";
import {ControlTool} from "./ControlTool";
import ProjectionEquation from "../../Domain/Models/Maths/ProjectionEquation";
import {Ellipse} from "../../Domain/Models/Maths/Shapes/Ellipse";
import {Vector2D} from "../../Domain/Models/Maths/Vector2D";

const rotateToolSize = 100;

export default class RotateTool extends ControlTool{
    
    private readonly size: number;
    private readonly axis: Axis3D;
    private currentJoint: Joint|undefined;
    
    constructor(size: number, axis: Axis3D) {
        super();
        this.size = size;
        this.axis = axis;
    }

    selectionEquation: ProjectionEquation | undefined;

    draw(
        ctx: CanvasRenderingContext2D,
        projection: Projection,
        joint: Joint|undefined
    ) {
        if (joint === undefined) { this.selectionEquation = undefined; return; }
        this.currentJoint = joint;
        if (!joint.isEndEffector && this.axis.id !== Axis3D.Z.id) { this.selectionEquation = undefined; return; }
        
        const drawAxis = (axis: Vector3D, centerPos: Vector3D) => {
            withLineWidth(this.hovered||this.selected
                ? ControlTool.selectedWidth
                : ControlTool.defaultWidth, ctx, () => {
                ctx.strokeStyle = this.axis.color.toRgbString();

                const { v0, v1 } = axis.planeFromNormal();

                const ell: Ellipse = projection.projectEllipse(
                    centerPos,
                    centerPos.plus(v0.normalized().scale(rotateToolSize)),
                    centerPos.plus(v1.normalized().scale(rotateToolSize)),
                );
                this.selectionEquation = ProjectionEquation.fromEllipse(ell);
                
                ctx.beginPath();
                ctx.ellipse(ell.center.x, ell.center.y, ell.radiusX, ell.radiusY, ell.rotation, 0, 2*Math.PI);
                ctx.stroke();
            });
        }
        
        let direction: Vector3D = Vector3D.Zero;
        switch (this.axis.id) {
            case 0: { direction = joint.transform.localX; break; }
            case 1: { direction = joint.transform.localY; break; }
            case 2: { direction = joint.transform.localZ; break; }
        }
        
        drawAxis(direction, joint.transform.origin);
        
    }
    
    private static RotationFactor: number = 1/2;
    
    protected onToolUpdate(arm: CottusArm): void {
        if (this.currentJoint === undefined) { return; }
        if (this.selectionEquation === undefined) { return; }
        
        console.log(this._deltaParam * RotateTool.RotationFactor);
        arm.rotateJoint(
            this.currentJoint.index, 
            this._deltaParam * RotateTool.RotationFactor
        );
    }
}