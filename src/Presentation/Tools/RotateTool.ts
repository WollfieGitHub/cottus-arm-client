import {Joint} from "../../Domain/Models/Joint";
import {CottusArm} from "../../Domain/Models/CottusArm";
import {Projection} from "../../Domain/Models/Maths/Projection/Projection";
import {withLineWidth} from "../Utils/CanvasUtil";
import {Axis3D} from "../../Domain/Models/Maths/Axis3D";
import {Vector3D} from "../../Domain/Models/Maths/Vector3D";
import {ControlTool} from "./ControlTool";
import ProjectionEquation from "../../Domain/Models/Maths/ProjectionEquation";
import {Ellipse} from "../../Domain/Models/Maths/Shapes/Ellipse";
import {normalizedAngle} from "../../Domain/Models/Maths/MathUtils";

const rotateToolSize = 100;

export default class RotateTool extends ControlTool{
    
    private readonly size: number;
    private readonly axis: Axis3D;
    private currentJoint: Joint|undefined;
    
    private _lastEllipseAxis: Vector3D = Vector3D.Zero;
    private _lastProjection: Projection|undefined;
    
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
        if (!joint.isEndEffector && this.axis.id !== Axis3D.Z.id) { this.selectionEquation = undefined; return; }
        this.currentJoint = joint;
        
        const drawAxis = (axis: Vector3D, centerPos: Vector3D) => {
            withLineWidth(this.hovered||this.selected
                ? ControlTool.selectedWidth
                : ControlTool.defaultWidth, ctx, () => {
                ctx.strokeStyle = this.axis.color.toRgbString();

                const { v0, v1 } = axis.planeFromNormal();

                const xAxis = v0.normalized().scale(rotateToolSize);
                const yAxis = v1.normalized().scale(rotateToolSize);
                
                // Record each axis for the ellipse
                this._lastEllipseAxis = xAxis.cross(yAxis).normalized();
                this._lastProjection = projection;
                
                const ell: Ellipse = projection.projectEllipse(
                    centerPos,
                    centerPos.plus(xAxis),
                    centerPos.plus(yAxis),
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
    
    protected onToolUpdate(arm: CottusArm): void {
        if (this.currentJoint === undefined) { return; }
        
        if (this.currentJoint.isEndEffector) { this.rotateEndEffector(arm, this.currentJoint); }
        else { this.rotateJoint(arm, this.currentJoint); }
    }
    
    protected rotateJoint(arm: CottusArm, joint: Joint): void {
        if (this._deltaParam === undefined) { return; }
        if (this.selectionEquation === undefined || this._lastProjection === undefined) { return; }

        const deltaAngle = // Compute if the camera is aligned with the axis or the opposite
            -this._lastEllipseAxis.dot(this._lastProjection.cameraDir())
            * normalizedAngle(this._deltaParam);

        arm.rotateJoint( joint.index, deltaAngle );
        
        console.log("BOOM")
    }
    
    protected rotateEndEffector(arm: CottusArm, joint: Joint): void {
        
    }
}