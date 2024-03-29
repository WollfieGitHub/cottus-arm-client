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
    
    private readonly size: number;
    private readonly axis: Axis3D;
    
    private lastAxisDirection: Vector2D | undefined;
    
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
        if (!joint.isEndEffector) { this.selectionEquation = undefined; return; }

        const drawAxis = (direction: Vector3D, origin: Vector3D) => {
            ctx.strokeStyle = this.axis.color.toRgbString();

            const [p0, p1] = projection.projectAll([
                origin, origin.plus(direction.scale(this.size))
            ])
            this.selectionEquation = ProjectionEquation.fromSeg(p0, p1);
            this.lastAxisDirection = projection.project(direction);

            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
        }

        let direction: Vector3D = Vector3D.Zero;
        switch (this.axis.id) {
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
        if (this._deltaParam === undefined 
            || this.lastAxisDirection === undefined 
            || this._deltaMousePos === undefined
            || this.selectionEquation === undefined
            || this._currentMousePos === undefined
        ) { console.log("Boo"); return; }
        
        // We can't directly use this._deltaParam because the end effector moves at the same time
        // contrary to the opposite, so we project the difference on the segment
        // i.e., we project "prev" and "current" at a same time t instead of two different times t1 and t2
        // in between of which the segment could have moved
        const deltaParam = Math.abs(this.selectionEquation.param(this._currentMousePos)
                - this.selectionEquation.param(this._currentMousePos.minus(this._deltaMousePos)))
        
        // Compute if the camera is aligned with the axis or the opposite
        const deltaPos = deltaParam * this.size * Math.sign(this.lastAxisDirection.dot( this._deltaMousePos )); // Direction of movement
        
        arm.moveEndEffector(this.axis, deltaPos);
    }
}