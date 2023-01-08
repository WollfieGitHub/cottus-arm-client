/** Standard Form 2DVector Equation : "Ax+Bx=C" */
import {Vector2D} from "./Vector2D";
import {BASE_PRECISION} from "../../../Constants";
import {Ellipse} from "./Shapes/Ellipse";
import {Axis3D} from "./Axis3D";
import {newtonRhapson} from "./MathUtils";
import {doesNotMatch} from "assert";

export type Equation = (v: Vector2D) => {proj: Vector2D, param: number, distance: number};
export default class ProjectionEquation {
    private readonly equation: Equation;

    constructor(equation: Equation) { this.equation = equation; }

    /**
     * @param v The vector to test as a solution
     * @param distance The precision with which to test
     * @return True if the given vector is solution of the equation with respect
     * to the specified precision, false otherwise
     */
    isSolution(v: Vector2D, distance: number = BASE_PRECISION): boolean {
        return this.distance(v) <= distance;
    }

    /**
     * Returns the distance to the internal equation of this object
     * @param v The vector with which to evaluate the equation
     */
    distance(v: Vector2D): number {
        return this.equation(v).distance;
    }

    /**
     * Project the given point onto the object represented by the equation and
     * return the parameter of the equation that corresponds to the projection
     * @param v The point to project
     */
    param(v: Vector2D): number {
        return this.equation(v).param;
    }

    projected(v: Vector2D): Vector2D {
        return this.equation(v).proj;
    }
    
    /**
     * Create the equation for an ellipse.<br>
     * <a href="https://math.stackexchange.com/questions/475436/2d-point-projection-on-an-ellipse">Source</a>
     * @param ellipse The ellipse object
     */
    static fromEllipse(ellipse: Ellipse): ProjectionEquation {
        const { center, radiusX: rX, radiusY: rY, rotation } = ellipse;
        
        const r: number = rX > rY ? rX : rY;
        const alpha: number = rX/r;
        const beta: number = rY/r;
        
        return new ProjectionEquation((v) => {
            const vOrigin: Vector2D = v.minus(center).rotatedAtOriginAround(Axis3D.Z.id, -rotation)
            // Avoid singularities when close to origin by placing the point out of the ellipse
                .normalized().scale(2*r);
            let { x: x0,y: y0 } = vOrigin;
            
            // The method is way more accurate in the first quadrant
            let [ x, y ] = [ Math.abs(x0), Math.abs(y0) ];
            
            const f = (theta: number) => {
                const cTheta = Math.cos(theta);
                const sTheta = Math.sin(theta);
                
                return (alpha*alpha - beta*beta) * r * cTheta * sTheta
                    - x * alpha * sTheta
                    + y * beta * cTheta;
            };
            
            const df = (theta: number) => {
                const cTheta = Math.cos(theta);
                const sTheta = Math.sin(theta);
                
                return (alpha*alpha - beta*beta) * r * (cTheta*cTheta - sTheta*sTheta)
                    - x * alpha * cTheta
                    - y * beta * sTheta;
            };
            
            // Width of the canvas / 4096 points
            const maxError: number = 2 / 8192;
            // Initial Guess
            const initialGuess = Math.atan2(alpha*y, beta*x);
            
            let theta = newtonRhapson(f, df, initialGuess, maxError, 1000);
            
            // Correct for the quadrant change
            if (x0 < 0 && y0 > 0) { theta = Math.PI - theta; }
            else if (x0 < 0 && y0 < 0) { theta = Math.PI + theta; }
            else if (x0 > 0 && y0 < 0) { theta = - theta}
            
            const vProj: Vector2D = new Vector2D(
                rX * Math.cos(theta),
                rY * Math.sin(theta),
            ).rotatedAtOriginAround(Axis3D.Z.id, rotation).plus(center);
            
            return { proj: vProj, param: theta, distance: v.minus(vProj).norm() };
        });
    }

    /**
     * Create the equation for a segment between two points
     * @param v0 One point of the segment
     * @param v1 The other point of the segment
     */
    static fromSeg(v0: Vector2D, v1: Vector2D): ProjectionEquation {
        // From https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
        return new ProjectionEquation((v) => {
            
            const project = (v0: Vector2D, v1: Vector2D, p: Vector2D): {proj: Vector2D, param: number} => {
                const A = p.x - v0.x, B = p.y - v0.y, C = v1.x - v0.x, D = v1.y - v0.y;

                const dot = A * C + B * D;
                const len_sq = C * C + D * D;
                let param = -1;
                if (len_sq !== 0) { param = dot / len_sq; }

                let xx, yy;

                if (param < 0) { xx = v0.x; yy = v0.y; }
                else if (param > 1) { xx = v1.x; yy = v1.y; }
                else { xx = v0.x + param * C; yy = v0.y + param * D; }

                return {
                    proj: new Vector2D(xx, yy),
                    param: param
                }
            }
            
            const { proj, param } = project(v0, v1, v);
            return { proj, param, distance: proj.minus(v).norm() };
        });
    }
    
    
} 