import {CottusArm} from "../../../../../Domain/Models/CottusArm";
import {Projection} from "../../../../../Domain/Models/Maths/Projection/Projection";
import {MutableRefObject, useEffect, useRef, useState} from "react";
import Canvas from "../../../../UIBase/Canvas";
import {Vector2D} from "../../../../../Domain/Models/Maths/Vector2D";
import {CanvasButtonEvent, CanvasMoveEvent} from "../../../../UIBase/CanvasEvent";

const selectionRadius: number = 0.01;

const distance = (a: Vector2D, b: Vector2D) => (b.x-a.x)*(b.x-a.x) + (b.y-a.y)*(b.y-a.y);

const useJointSelection = (
    canvas: Canvas | undefined,
    armRef: MutableRefObject<CottusArm|undefined>,
    projectionRef: MutableRefObject<Projection|undefined>
) => {

    const [ selectedJoint, setSelectedJoint ] = useState<string|undefined>();
    const [ hoveredJoint, _setHoveredJoint ] = useState<string|undefined>();
    const hoveredJointRef = useRef(hoveredJoint);
    const setHoveredJoint = (hoveredJoint: string|undefined): void => {
        hoveredJointRef.current = hoveredJoint;
        _setHoveredJoint(hoveredJoint);
    }
    
    const canvasIsLoaded: boolean = canvas !== undefined;

    const onCanvasMoved = (evt: CanvasMoveEvent) => {
        const { x, y } = evt.pos;

        const arm = armRef.current;
        const projection = projectionRef.current;
        if (arm === undefined || projection === undefined) { return; }

        // Sort all joints with their distance to clicked location
        const joints = arm.joints.map(joint => {
            return { proj: projection.project(joint.transform.origin), name: joint.name };
        }).sort((a, b) => {
            return distance(a.proj, new Vector2D(x, y)) - distance(b.proj, new Vector2D(x, y));
        });
        
        // Means there is no joint in the arm
        if (joints.length <= 0) { setHoveredJoint(undefined); return; }

        const candidate = joints[0];
        // Set the hovered joint or remove it depending on distance
        if (distance(candidate.proj, new Vector2D(x, y)) <= selectionRadius) { setHoveredJoint(candidate.name); }
        else { setHoveredJoint(undefined); }
    }
    
    const onCanvasClicked = (evt: CanvasButtonEvent) => {
        if (hoveredJointRef.current !== undefined && evt.button !== 2 && evt.btnDown) { setSelectedJoint(hoveredJointRef.current); }
        // Wants to deselect, so clicked on no joint
        else if (evt.button !== 2 && evt.btnDown) { setSelectedJoint(undefined); }
    }
    
    useEffect(() => {
        canvas?.addListener("canvasMove", onCanvasMoved);
        canvas?.addListener("canvasButton", onCanvasClicked);
        
    }, [ canvasIsLoaded ])
    
    return { hoveredJoint, selectedJoint }
}

export default useJointSelection;