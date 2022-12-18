import React, {useEffect, useState} from "react";
import {Vector3D} from "../../../../../Domain/Models/Maths/Vector3D";
import {Projection, ProjectionType} from "../../../../../Domain/Models/Maths/projection/Projection";
import {Axis3D} from "../../../../../Domain/Models/Maths/Axis3D";
import {OrthographicProjection} from "../../../../../Domain/Models/Maths/projection/OrthographicProjection";
import PerspectiveProjection from "../../../../../Domain/Models/Maths/projection/PerspectiveProjection";
import Canvas from "../../../../UIBase/Canvas";

const createProjection = (
    rotX: number, rotZ: number, 
    type: ProjectionType,
    zoom: number = 1,
    canvasWidth: number,
    canvasHeight: number,
): Projection => {
    
    const perspectiveRotVector: Vector3D = new Vector3D(rotX+2*Math.PI/3,0, rotZ-Math.PI/4);
    const rotVector: Vector3D = new Vector3D(-rotX,0, rotZ-Math.PI/4);
    const posVector: Vector3D = new Vector3D(0,750, 750);
    switch (type) {
        case ProjectionType.Orthographic: {
            const orthographicZoomMultiplier: number = 1.5
            // Because we look at center of referential :
            const dirVector: Vector3D = Vector3D.Zero.subtract(posVector);
            const zUnit: Vector3D = Axis3D.Z.unitVector;
            const upVector: Vector3D = zUnit.subtract(dirVector.scale(zUnit.projectedOnto(dirVector)));
            const rightVector: Vector3D = dirVector.cross(upVector).scale(-1);

            return new OrthographicProjection(
                rightVector.rotatedAtOriginUsing(rotVector),
                upVector.scale(-1).rotatedAtOriginUsing(rotVector),
                canvasWidth*orthographicZoomMultiplier*zoom,
                canvasHeight*orthographicZoomMultiplier*zoom
            );
        }
        case ProjectionType.Perspective: {
            return new PerspectiveProjection(
                posVector, perspectiveRotVector,
                100.0, 0.1, 70,
                canvasWidth/canvasHeight
            )
        }
    }
}

const useCanvasNavigation = (
    canvas: Canvas|undefined, 
    canvasWidth: number, 
    canvasHeight: number
) => {
    const [ rightClick, setRightClick ] = useState(false);
    
    const [ rotX, setRotX ] = useState(0);
    const [ rotZ, setRotZ ] = useState(0);
    
    const [ zoomLevel, setZoomLevel ] = useState<number>(2);
    
    const [ projectionType, setProjectionType ] = useState<ProjectionType>(ProjectionType.Orthographic);
    const [ projection, setProjection ] = useState<Projection>();

    // Handle zoom navigation
    const handleScroll = (args: any) => {
        const { deltaScroll } = args;
        const delta = deltaScroll.y*0.001;
        setZoomLevel(Math.max(zoomLevel+delta, 0.01));
    }

    // Handle rotation navigation
    const handleMouseBtn = (args: any) => {
        const { button, type, deltaPos } = args;
        
        if (!rightClick && type === "mouseDown" && button === 2) { setRightClick(true); }
        else if (rightClick && type === "mouseUp" && button === 2) { setRightClick(false); }
        
        if (rightClick) {
            console.log(deltaPos)
            setRotX(rotX-deltaPos.y*0.01);
            setRotZ(rotZ+deltaPos.x*0.01);
        }
    }

    const canvasIsLoaded: boolean = canvas !== undefined;
    
    useEffect(() => {
        canvas?.addListener('scroll', handleScroll);
        canvas?.addListener('mouseDown', handleMouseBtn);
        canvas?.addListener('mouseUp', handleMouseBtn);
        canvas?.addListener('mouseMove', handleMouseBtn);
    }, [ canvasIsLoaded ])

    // Recompute the projection each time the rotX or rotZ changes
    useEffect(() => {
        setProjection(createProjection(
            rotX, rotZ, 
            projectionType, zoomLevel,
            canvasWidth, canvasHeight,
        ));
    }, [rotX, rotZ, projectionType, zoomLevel, canvasWidth, canvasHeight])
    
    return { projection: projection, setProjection: setProjectionType };
}

export default useCanvasNavigation;