import {CottusArm} from "../../../../../Domain/Models/CottusArm";
import {Projection} from "../../../../../Domain/Models/Maths/projection/Projection";
import React, {useEffect, useState} from "react";
import {X509Certificate} from "crypto";
import Canvas from "../../../../UIBase/Canvas";

type Vector2D = {x:number, y:number};
const selectionRadius: number = 0.1;

const useJointSelection = (
    canvas: Canvas | undefined,
    arm: CottusArm | undefined,
    projection: Projection | undefined
) => {
    
    const [ hoveredJoint, setHoveredJoint ] = useState<string|undefined>();
    const [ selectedJoint, setSelectedJoint ] = useState<string|undefined>();
    
    const distance = (a: Vector2D, b: Vector2D) => {
        return (b.x-a.x)*(b.x-a.x) + (b.y-a.y)*(b.y-a.y);
    }
    
    const canvasIsLoaded: boolean = canvas !== undefined;

    const onCanvasMove = (args: any) => {
        const { pos } = args;
        if (arm === undefined || projection === undefined) { return; }

        const { x, y } = pos;

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

    const onCanvasClick = (args: any) => {
        if (hoveredJoint !== undefined) { setSelectedJoint(hoveredJoint); }
        // Wants to deselect, so clicked on no joint
        else { setSelectedJoint(undefined); }
    }
    
    useEffect(() => {
        
        canvas?.addListener("mouseMove", onCanvasMove);
        canvas?.addListener("mouseClick", onCanvasClick);
        
    }, [canvasIsLoaded])
    
    return { hoveredJoint, selectedJoint }
}

export default useJointSelection;