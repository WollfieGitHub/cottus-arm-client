import {Vector3D} from "../Vector3D";

export abstract class Projection {

    /**
     * Project the vector from world space to "camera" space
     * using the implementation of the projection
     * @param worldSpace A vector in world space
     * @return Vector3D A vector with coordinates x and y in the interval [-1, 1] 
     * @return undefined If the vector is not visible in the viewport. it shouldn't be drawn
     */
    abstract project(worldSpace: Vector3D): Vector3D;

    /**
     * Project all given vectors in the {@code worldSpace} array and only
     * execute the {@code use} function if all projected vectors
     * are visible 
     * @param worldSpace An array of vectors in world space
     */
    projectAll(worldSpace: Vector3D[]): Vector3D[] {
        return worldSpace.map(v => this.project(v));
    }
}