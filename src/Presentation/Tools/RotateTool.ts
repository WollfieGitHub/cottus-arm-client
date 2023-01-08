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
import Color from "../Utils/Color";

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
                this._lastEllipseAxis = xAxis.cross(yAxis);
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
            case 0: { direction = joint.isEndEffector ? Axis3D.X.unitVector : joint.transform.localX; break; }
            case 1: { direction = joint.isEndEffector ? Axis3D.Y.unitVector : joint.transform.localY; break; }
            case 2: { direction = joint.isEndEffector ? Axis3D.Z.unitVector : joint.transform.localZ; break; }
        }
        
        drawAxis(direction, joint.transform.origin);
        
    }
    
    protected onToolUpdate(arm: CottusArm): void {
        if (this.currentJoint === undefined) { return; }
        if (this._deltaParam === undefined) { return; }
        if (this.selectionEquation === undefined || this._lastProjection === undefined) { return; }

        const deltaAngle = // Compute if the camera is aligned with the axis or the opposite
            -Math.sign(this._lastEllipseAxis.normalized().dot(this._lastProjection.cameraDir().normalized()))
            * normalizedAngle(this._deltaParam);

        console.log(deltaAngle);
        
        if (this.currentJoint.isEndEffector) { arm.rotateEndEffector(this.axis, deltaAngle); }
        else { arm.rotateJoint( this.currentJoint.index, deltaAngle ); }
    }
}