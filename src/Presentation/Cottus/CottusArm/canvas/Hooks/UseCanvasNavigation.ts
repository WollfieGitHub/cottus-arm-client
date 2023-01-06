import {MutableRefObject, useEffect, useRef, useState} from "react";
import {Vector3D} from "../../../../../Domain/Models/Maths/Vector3D";
import {Projection, ProjectionType} from "../../../../../Domain/Models/Maths/Projection/Projection";
import {Axis3D} from "../../../../../Domain/Models/Maths/Axis3D";
import {OrthographicProjection} from "../../../../../Domain/Models/Maths/Projection/OrthographicProjection";
import PerspectiveProjection from "../../../../../Domain/Models/Maths/Projection/PerspectiveProjection";
import Canvas from "../../../../UIBase/Canvas";
import {CanvasButtonEvent, CanvasMoveEvent} from "../../../../UIBase/CanvasEvent";

const MovementFactor = 0.25;
const ScrollFactor = 0.05;

const createProjection = (
    rotX: number, rotZ: number, 
    type: ProjectionType, zoom: number = 1,
    canvasWidth: number, canvasHeight: number,
): Projection => {
    const perspectiveRotVector: Vector3D = new Vector3D(rotX+2*Math.PI/3,0, rotZ-Math.PI/4);
    const rotVector: Vector3D = new Vector3D(-rotX,0, rotZ-Math.PI/4);
    const posVector: Vector3D = new Vector3D(0,750, 750);
    
    switch (type) {
        case ProjectionType.Orthographic: {
            const orthographicZoomMultiplier: number = 1.5
            // Because we look at center of referential :
            const dirVector: Vector3D = Vector3D.Zero.minus(posVector);
            const zUnit: Vector3D = Axis3D.Z.unitVector;
            const upVector: Vector3D = zUnit.minus(dirVector.scale(zUnit.projectedOnto(dirVector)));
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
    canvas: Canvas | undefined, 
    canvasWidth: number, canvasHeight: number,
    dtRef: MutableRefObject<number>,
) => {
    // This is mandatory as the functions are only built for the current render
    const [ rightClick, _setRightClick ] = useState(false);
    const rightClickRef = useRef(rightClick);
    const setRightClick = (rightClick: boolean): void => {
        rightClickRef.current = rightClick;
        _setRightClick(rightClick);
    }
    
    const [ rotX, setRotX ] = useState(0);
    const [ rotZ, setRotZ ] = useState(0);
    
    const [ zoomLevel, setZoomLevel ] = useState<number>(1.4747);
    
    const [ projectionType, setProjectionType ] = useState<ProjectionType>(ProjectionType.Orthographic);
    const [ projection, setProjection ] = useState<Projection>();

    // Handle zoom navigation
    const handleScroll = (args: any) => {
        const { deltaScroll } = args;
        
        setZoomLevel(zoomLevel => {
            const delta = deltaScroll.y * dtRef.current * ScrollFactor;
            return Math.max(zoomLevel+delta, 0.01)
        });
    }
    
    // Handle rotation navigation
    const handleMouseBtn = (evt: CanvasButtonEvent) => {
        const { button, btnDown } = evt;
        
        if (btnDown && button === 2) { setRightClick(true); }
        else if (!btnDown && button === 2) { setRightClick(false); }
    }
    
    const handleMouseMove = (evt: CanvasMoveEvent) => {
        const { deltaPos } = evt;
        
        if (rightClickRef.current) {
            setRotX(rotX => rotX-deltaPos.y * dtRef.current * MovementFactor);
            setRotZ(rotZ => rotZ+deltaPos.x * dtRef.current * MovementFactor);
        }
    }

    const canvasIsLoaded: boolean = canvas !== undefined;
    
    useEffect(() => {
        canvas?.addListener('scroll', handleScroll);
        canvas?.addListener('canvasButton', handleMouseBtn);
        canvas?.addListener('canvasMove', handleMouseMove);
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