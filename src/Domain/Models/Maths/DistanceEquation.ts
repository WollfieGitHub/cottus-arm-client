/** Standard Form 2DVector Equation : "Ax+Bx=C" */
import {Vector2D} from "./Vector2D";
import {BASE_PRECISION} from "../../../Constants";
import {Vector3D} from "./Vector3D";
import {Ellipse} from "./Shapes/Ellipse";

export default class DistanceEquation {
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
    static fromEllipse(ellipse: Ellipse): DistanceEquation {
        const { center, radiusX, radiusY, rotation } = ellipse;
        
        return new DistanceEquation((v) => {
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
    static fromSeg(v0: Vector2D, v1: Vector2D): DistanceEquation {
        // From https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
        return new DistanceEquation((v) => {
            
            const distToSegSquared = (v0: Vector2D, v1: Vector2D, p: Vector2D): number => {
                const A = p.x - v0.x, B = p.y - v0.y, C = v1.x - v0.x, D = v1.y - v0.y;

                const dot = A * C + B * D;
                const len_sq = C * C + D * D;
                let param = -1;
                if (len_sq !== 0) { param = dot / len_sq; }

                let xx, yy;

                if (param < 0) { xx = v0.x; yy = v0.y; }
                else if (param > 1) { xx = v1.x; yy = v1.y; }
                else { xx = v0.x + param * C; yy = v0.y + param * D; }

                const dx = p.x - xx, dy = p.y - yy;
                return dx * dx + dy * dy
            }
            
            return Math.sqrt(distToSegSquared(v0, v1, v))
        });
    }
    
    
} 