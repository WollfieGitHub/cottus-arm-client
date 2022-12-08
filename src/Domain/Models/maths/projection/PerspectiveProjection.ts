import {Projection} from "./Projection";
import {Vector3D} from "../Vector3D";

export default class PerspectiveProjection extends Projection {
    
    /** A vector that is not visible in the field of view (As all projected vectors
     * have their x,y coordinates in [-1, 1]*/
    private static readonly InvisibleVector: Vector3D = new Vector3D(-2, -2, 1);
    
    /** The position of the camera in world space */
    private readonly cameraPos: Vector3D;
    /** The rotation of the camera given as euler angles in world space */
    private readonly cameraRot: Vector3D;
    
    /** The distance of the "far" plane relative to the camera */
    private readonly far: number;
    /** The distance of the "near" plane relative to the camera */
    private readonly near: number;
    
    /** The field of view of the camera given in degrees */
    private readonly fov: number;
    /** The aspect ratio of the camera */
    private readonly aspect: number;
    
    constructor(cameraPos: Vector3D, cameraRot: Vector3D, far: number, near: number, fov: number, aspect: number) {
        super();
        this.cameraPos = cameraPos;
        this.cameraRot = cameraRot;
        this.far = far;
        this.near = near;
        this.fov = fov;
        this.aspect = aspect;
    }

    project(worldSpaceP: Vector3D): Vector3D {
        const focalLength = 1/(Math.tan( this.fov*Math.PI/360 ) * this.aspect);
        
        // The point in the camera space
        // Y rotation is not useful here
        const camSpaceP = worldSpaceP.subtract(this.cameraPos)
            .rotatedAtOriginAround(2, -this.cameraRot.z)
            .rotatedAtOriginAround(0, -this.cameraRot.x)
        
        let { x: rX, y: rY, z: rZ } = camSpaceP;
        
        const wClip = -rZ;
        const xClip = focalLength*rX/wClip;
        const yClip = focalLength*rY/wClip;
        const zClip = ((this.near+this.far)/(this.near-this.far) * rZ 
            + 2*(this.near*this.far)/(this.near-this.far) ) / wClip;
        
        // Hide the vectors which are behind the camera. This is not a good
        // solution but it is good enough one since the camera target will always
        // be centered on the arm
        if (rZ <= 0) { return PerspectiveProjection.InvisibleVector; }
        
        return new Vector3D(xClip, yClip, zClip);
    }
    
}