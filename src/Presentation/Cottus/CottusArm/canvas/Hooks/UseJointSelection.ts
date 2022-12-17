﻿import {CottusArm} from "../../../../../Domain/Models/CottusArm";
import {Projection} from "../../../../../Domain/Models/maths/projection/Projection";
import React, {useState} from "react";
import {X509Certificate} from "crypto";

type Vector2D = {x:number,y:number};
const selectionRadius: number = 0.1;

const useJointSelection = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    arm: CottusArm | undefined,
    projection: Projection | undefined
) => {
    
    const [ hoveredJoint, setHoveredJoint ] = useState<string|undefined>();
    const [ selectedJoint, setSelectedJoint ] = useState<string|undefined>();
    
    const distance = (a: Vector2D, b: Vector2D) => {
        return (b.x-a.x)*(b.x-a.x) + (b.y-a.y)*(b.y-a.y);
    }
    
    const resetSelection = () => {
        setHoveredJoint(undefined);
        setSelectedJoint(undefined);
    }
    
    const onCanvasMove = (x: number, y:number) => {
        if (arm === undefined || projection === undefined) { return; }
        
        // Sort all joints with their distance to clicked location
        const joints = arm.joints.map(joint => {
            return { proj: projection.project(joint.globalPosition), name: joint.name };
        }).sort((a, b) => {
            return distance(a.proj, {x,y}) - distance(b.proj, {x,y});
        });
        // Means there is no joint in the arm
        if (joints.length <= 0) { setHoveredJoint(undefined); return; }
        
        const candidate = joints[0];
        // Set the hovered joint or remove it depending on distance
        if (distance(candidate.proj, {x,y}) <= selectionRadius) { setHoveredJoint(candidate.name); }
        else { setHoveredJoint(undefined); }
    }
    
    const onCanvasClick = () => {
        if (hoveredJoint !== undefined) { setSelectedJoint(hoveredJoint); }
        // Wants to deselect, so clicked on no joint
        else { setSelectedJoint(undefined); }
    }
    
    return { onMouseMoved: onCanvasMove, onMouseClicked: onCanvasClick, hoveredJoint, selectedJoint }
}

export default useJointSelection;