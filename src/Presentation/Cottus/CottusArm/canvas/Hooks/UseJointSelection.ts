import {CottusArm} from "../../../../../Domain/Models/CottusArm";
import {Projection} from "../../../../../Domain/Models/Maths/Projection/Projection";
import React, {MutableRefObject, RefObject, useEffect, useRef, useState} from "react";
import {X509Certificate} from "crypto";
import Canvas from "../../../../UIBase/Canvas";
import {Vector2D} from "../../../../../Domain/Models/Maths/Vector2D";
import {CanvasMoveEvent} from "../../../../UIBase/CanvasEvent";

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

    const onCanvasMove = (evt: CanvasMoveEvent) => {
        const { x, y } = evt.pos;

        const arm = armRef.current;
        const projection = projectionRef.current;
        if (arm === undefined || projection === undefined) { return; }

        // Sort all joints with their distance to clicked location
        const joints = arm.joints.map(joint => {
            return { proj: projection.project(joint.globalPosition), name: joint.name };
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
    
    const onCanvasClick = () => {
        if (hoveredJointRef.current !== undefined) { setSelectedJoint(hoveredJointRef.current); }
        // Wants to deselect, so clicked on no joint
        else { setSelectedJoint(undefined); }
    }
    
    useEffect(() => {
        canvas?.addListener("canvasMove", onCanvasMove);
        canvas?.addListener("canvasClick", onCanvasClick);
        
    }, [ canvasIsLoaded ])
    
    return { hoveredJoint, selectedJoint }
}

export default useJointSelection;