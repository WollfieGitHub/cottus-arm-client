import {CottusArm} from "../../Domain/Models/CottusArm";
import {Joint} from "../../Domain/Models/Joint";
import {Vector3D} from "../../Domain/Models/Maths/Vector3D";
import {Axis3D} from "../../Domain/Models/Maths/Axis3D";
import {Projection} from "../../Domain/Models/Maths/Projection/Projection";
import {withLineWidth} from "../Utils/CanvasUtil";
import {ControlTool} from "./ControlTool";
import ProjectionEquation from "../../Domain/Models/Maths/ProjectionEquation";
import {Vector2D} from "../../Domain/Models/Maths/Vector2D";


export default class MoveTool extends ControlTool {
    
    private readonly _size: number;
    private readonly _axis: Axis3D;
    
    private _lastAxisDirection: Vector2D | undefined;
    private _xAxisProjection: Vector2D | undefined;
    
    constructor(size: number, axis: Axis3D) {
        super();
        this._size = size;
        this._axis = axis;
    }

    selectionEquation: ProjectionEquation | undefined;

    draw(
        ctx: CanvasRenderingContext2D,
        projection: Projection,
        joint: Joint|undefined
    ) {
        if (joint === undefined) { this.selectionEquation = undefined; return; }
        if (!joint.isEndEffector) { this.selectionEquation = undefined; return; }

        const drawAxis = (direction: Vector3D, origin: Vector3D) => {
            ctx.strokeStyle = this._axis.color.toRgbString();

            const [p0, p1] = projection.projectAll([
                origin, origin.plus(direction.scale(this._size))
            ])
            this.selectionEquation = ProjectionEquation.fromSeg(p0, p1);
            this._lastAxisDirection = projection.project(direction).normalized();
            this._xAxisProjection = projection.project(Axis3D.X.unitVector).normalized();

            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
        }

        let direction: Vector3D = Vector3D.Zero;
        switch (this._axis.id) {
            case 0: { direction = (joint.isEndEffector ? Axis3D.X.unitVector : joint.transform.localX); break; }
            case 1: { direction = (joint.isEndEffector ? Axis3D.Y.unitVector : joint.transform.localY); break; }
            case 2: { direction = (joint.isEndEffector ? Axis3D.Z.unitVector : joint.transform.localZ); break; }
        }
        
        withLineWidth(this.hovered||this.selected
                ? ControlTool.selectedWidth 
                : ControlTool.defaultWidth, ctx, () => {
            drawAxis(direction, joint.transform.origin);
        })
    }

    protected onToolUpdate(arm: CottusArm): void {
        if (this._deltaParam === undefined || this._lastAxisDirection === undefined || this._xAxisProjection === undefined) { return; }

        // Compute if the camera is aligned with the axis or the opposite
        const deltaPos = this._deltaParam * this._size * this._lastAxisDirection.dot(this._xAxisProjection);
        arm.moveEndEffector(this._axis, deltaPos);
    }
}