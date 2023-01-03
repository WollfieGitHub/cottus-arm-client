import {Vector3D} from "../Vector3D";
import {Ellipse} from "../Shapes/Ellipse";
import {Axis3D} from "../Axis3D";
import {Vector2D} from "../Vector2D";

export abstract class Projection {

    /**
     * Project the vector from world space to "camera" space
     * using the implementation of the projection
     * @param worldSpace A vector in world space
     * @return Vector3D A vector with coordinates x and y in the interval [-1, 1] 
     * @return undefined If the vector is not visible in the viewport. it shouldn't be drawn
     */
    abstract project(worldSpace: Vector3D): Vector2D;

    /**
     * Project all given vectors in the {@code worldSpace} array and only
     * execute the {@code use} function if all projected vectors
     * are visible 
     * @param worldSpace An array of vectors in world space
     */
    projectAll(worldSpace: Vector3D[]): Vector3D[] {
        return worldSpace.map(v => this.project(v));
    }

    /**
     * Project an ellipse from its two semi axis into a 2 dimensional ellipse using the projection
     * @param center The center of the ellipse
     * @param semiAxisX The end of the semi axis X in one direction
     * @param semiAxisY The end of the semi axis Y in one direction
     */
    projectEllipse(center: Vector3D, semiAxisX: Vector3D, semiAxisY: Vector3D): Ellipse {
        const C: Vector3D = this.project(center);
        const P: Vector3D = this.project(semiAxisX);
        const Q: Vector3D = this.project(semiAxisY);
        
//=========   ====  == =
//      FIND THE CONJUGATE FROM PROJECTED AXES
//      Source : https://en.wikipedia.org/wiki/Rytz%27s_construction
//=========   ====  == =
        
        // Here we use Rytz's construction to find the origin diameters of the projected ellipse
        // from the conjugate diameters : 
        const PtoP1 = -Math.PI/2.0 * Math.sign(P.angleTo(Q));
        // Put P at origin
        const P0 = P.minus(C);
        // Rotate point 90deg and undo translation
        const P1 = new Vector3D(
            P0.x * Math.cos(PtoP1) - P0.y*Math.sin(PtoP1),
            P0.y * Math.cos(PtoP1) + P0.x*Math.sin(PtoP1),
            0).plus(C);
        // Construct center of P' and D
        const D = Q.plus(P1).scale(0.5);
        // Construct circle from D to C
        const cd = D.minus(C).norm();
        // Get both ends of the semicircle
        const B = Q.minus(D).normalized().scale(cd).plus(D);
        const A = D.minus(Q).normalized().scale(cd).plus(D);
        // Norm of a and b, conjugate semi axes
        const radiusX = A.minus(Q).norm();
        const radiusY = B.minus(Q).norm();
        const ellipseXRad = B.minus(C);
        
        return { 
            radiusX, radiusY, center: C,
            rotation: Math.atan2(ellipseXRad.y, ellipseXRad.x)
        }
    }
}

export enum ProjectionType {
    Orthographic,
    Perspective
}