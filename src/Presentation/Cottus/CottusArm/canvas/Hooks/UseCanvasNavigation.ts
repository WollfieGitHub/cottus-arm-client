import React, {useEffect, useState} from "react";
import {Vector3D} from "../../../../../Domain/Models/maths/Vector3D";
import {Projection, ProjectionType} from "../../../../../Domain/Models/maths/projection/Projection";
import {Axis3D} from "../../../../../Domain/Models/maths/Axis3D";
import {OrthographicProjection} from "../../../../../Domain/Models/maths/projection/OrthographicProjection";
import PerspectiveProjection from "../../../../../Domain/Models/maths/projection/PerspectiveProjection";
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
    canvas: Canvas, 
    canvasWidth: number, 
    canvasHeight: number
) => {
    const [ rightClick, setRightClick ] = useState(false);
    
    const [ rotX, setRotX ] = useState(0);
    const [ rotZ, setRotZ ] = useState(0);
    
    const [ zoomLevel, setZoomLevel ] = useState<number>(2);
    
    const [ projectionType, setProjectionType ] = useState<ProjectionType>(ProjectionType.Orthographic);
    const [ projection, setProjection ] = useState<Projection>();
    
    useEffect(() => {
        canvas.addListener("scroll", handleScroll);
        canvas.addListener("mouseDown", handleMouseBtn);
        canvas.addListener("mouseUp", handleMouseBtn);
    })

    // Handle zoom navigation
    // @ts-ignore
    const handleScroll = ({ deltaScroll }) => {
        const delta = deltaScroll.y*0.001;
        setZoomLevel(Math.max(zoomLevel+delta, 0.01));
    }

    // Handle rotation navigation
    // @ts-ignore
    const handleMouseBtn = ({ button, type, deltaPos }) => {
        if (!rightClick && type === "mouseDown" && button === 2) { setRightClick(true); }
        else if (rightClick && type === "mouseUp" && button === 2) { setRightClick(false); }

        if (rightClick) {
            setRotX(rotX-deltaPos.y*0.01);
            setRotZ(rotZ+deltaPos.x*0.01);
        }
    }

    // Recompute the projection each time the rotX or rotZ changes
    useEffect(() => {
        setProjection(createProjection(
            rotX, rotZ, 
            projectionType, zoomLevel,
            canvasWidth, canvasHeight,
        ));
    }, [rotX, rotZ, projectionType, zoomLevel, canvasWidth, canvasHeight])
    
    return { projection: projection, handleScroll: handleScroll, handleMouseEvt: handleMouseBtn, setProjection: setProjectionType };
}

export default useCanvasNavigation;