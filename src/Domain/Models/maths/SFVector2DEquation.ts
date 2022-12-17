/** Standard Form 2DVector Equation : "Ax+Bx=C" */
import {Vector2D} from "./Vector2D";
import {BASE_PRECISION} from "../../../Constants";
import {Vector3D} from "./Vector3D";
import {Ellipse} from "./Shapes/Ellipse";

export default class SFVector2DEquation {
    private readonly evaluate: (v: Vector2D) => number;

    constructor(evaluate: (v: Vector2D) => number) { this.evaluate = evaluate; }

    /**
     * @param v The vector to test as a solution
     * @param distance The precision with which to test
     * @return True if the given vector is solution of the equation with respect
     * to the specified precision, false otherwise
     */
    isSolution(v: Vector2D, distance: number = BASE_PRECISION): boolean {
        return this.evaluate(v) <= distance;
    }

    /**
     * Returns the distance to the internal equation of this object
     * @param v The vector with which to evaluate the equation
     */
    distance(v: Vector2D): number {
        return this.evaluate(v);
    }

    /**
     * Create the equation for an ellipse
     * @param ellipse The ellipse object
     */
    static fromEllipse(ellipse: Ellipse): SFVector2DEquation {
        const { center, radiusX, radiusY, rotation } = ellipse;
        
        return new SFVector2DEquation((v) => {
            v = v.subtract(new Vector3D(center.x, center.y, 0));
            
            const a: number = v.x*Math.cos(rotation) + v.y*Math.sin(rotation);    
            const b: number = v.x*Math.sin(rotation) - v.y*Math.cos(rotation);    
             
            return Math.abs((a*a)/(radiusX*radiusX) + (b*b)/(radiusY*radiusY) - 1);
        });
    }

    /**
     * Create the equation for a segment between two points
     * @param v0 One point of the segment
     * @param v1 The other point of the segment
     */
    static fromSeg(v0: Vector2D, v1: Vector2D): SFVector2DEquation {
        // From https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
        return new SFVector2DEquation((v) => {
           
            const sqr = (a: number) => a*a;
            const dist = (v0: Vector2D, v1: Vector2D) => { return sqr(v0.x - v1.x) + sqr(v0.y - v1.y) }
            
            const distToSegSquared = (v0: Vector2D, v1: Vector2D, p: Vector2D): number => {
                const l2 = dist(v0, v1);
                if (l2 === 0) { return dist(p, v0); }
                let t = ((p.x - v0.x) * (v1.x - v0.x) + (p.y - v0.y) * (v1.y - v0.y)) / l2;
                t = Math.max(0, Math.min(1, t));
                return dist(p, new Vector2D(v0.x + t * (v1.x - v0.x), v0.y + t * (v1.y - v0.y)));
            }
            
            return Math.sqrt(distToSegSquared(v0, v1, v))
        });
    }
    
    
} 