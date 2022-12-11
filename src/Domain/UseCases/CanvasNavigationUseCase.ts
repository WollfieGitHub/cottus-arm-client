import React, {useEffect, useState} from "react";
import {Vector3D} from "../Models/maths/Vector3D";
import {Projection, ProjectionType} from "../Models/maths/projection/Projection";
import {Axis3D} from "../Models/maths/Axis3D";
import {OrthographicProjection} from "../Models/maths/projection/OrthographicProjection";
import PerspectiveProjection from "../Models/maths/projection/PerspectiveProjection";

const createProjection = (
    rotX: number, rotZ: number, 
    type: ProjectionType,
    zoom: number = 1,
    canvasWidth: number,
    canvasHeight: number,
): Projection => {
    const perspectiveRotVector: Vector3D = new Vector3D(rotX+2*Math.PI/3,0, rotZ-Math.PI/4);
    const rotVector: Vector3D = new Vector3D(rotX,0, rotZ-Math.PI/4);
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
    divRef: React.RefObject<HTMLCanvasElement>, 
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
        divRef.current?.addEventListener('wheel', preventDefault);
        divRef.current?.addEventListener('mousedown', preventDefault);
        divRef.current?.addEventListener('click', preventDefault);
        divRef.current?.addEventListener('contextmenu', preventDefault);
    }, [divRef]);

    // Prevent the default action of the interaction with the div, since we want to navigate in canvas instead
    const preventDefault: (this: HTMLDivElement, e: any) => any = (evt: any) => {
        if (evt.type === "click" && evt.button === 2) { evt.preventDefault(); } 
        else if (evt.type === "wheel") { evt.preventDefault(); } 
        else if (evt.type === "contextmenu") { evt.preventDefault(); }
    }

    // Handle zoom navigation
    // @ts-ignore
    const handleScroll = (evt: WheelEvent<HTMLDivElement>) => {
        const delta = evt.deltaY*0.001;
        setZoomLevel(Math.max(zoomLevel+delta, 0.01));
    }

    // Handle rotation navigation
    // @ts-ignore
    const handleMouseEvt = (evt: MouseEvent<HTMLDivElement>) => {
        if (!rightClick && evt.type === "mousedown" && evt.button === 2) { setRightClick(true); }
        else if (rightClick && evt.type === "mouseup" && evt.button === 2) { setRightClick(false); }

        if (rightClick) {
            setRotX(rotX-evt.movementY*0.01);
            setRotZ(rotZ+evt.movementX*0.01);
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
    
    return { projection: projection, handleScroll: handleScroll, handleMouseEvt: handleMouseEvt };
}

export default useCanvasNavigation;