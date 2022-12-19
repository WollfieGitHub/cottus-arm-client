import RotateTool from "../../../../Tools/RotateTool";
import {Axis3D} from "../../../../../Domain/Models/Maths/Axis3D";
import MoveTool from "../../../../Tools/MoveTool";
import {Vector2D} from "../../../../../Domain/Models/Maths/Vector2D";
import {useEffect, useState} from "react";
import {ControlTool} from "../../../../Tools/ControlTool";
import {Projection} from "../../../../../Domain/Models/Maths/projection/Projection";
import {Joint} from "../../../../../Domain/Models/Joint";
import Canvas from "../../../../UIBase/Canvas";
import {CanvasClickEvent} from "../../../../UIBase/CanvasEventAdapter";

// Tools to rotate a node
const rToolX: RotateTool = new RotateTool(100, Axis3D.X);
const rToolY: RotateTool = new RotateTool(100, Axis3D.Y);
const rToolZ: RotateTool = new RotateTool(100, Axis3D.Z);

// Tools to move a node
const mToolX: MoveTool = new MoveTool(150, Axis3D.X);
const mToolY: MoveTool = new MoveTool(150, Axis3D.Y);
const mToolZ: MoveTool = new MoveTool(150, Axis3D.Z);

const tools = [ rToolX, rToolY, rToolZ, mToolX, mToolY, mToolZ ];

// Hover a tool and notify it has been hovered
const hover = (tool: ControlTool|undefined) => {
    for (let t of tools) { if (tool !== t) { t.hovered = false; } }
    if (tool !== undefined) { tool.hovered = true; }
}

const ToolSelectionRadius: number = 0.02;

const useControlTools = ( canvas: Canvas|undefined ) => {
    
    // Selects a tool and notify it has been selected
    const select = (evt: CanvasClickEvent) => { 
        let selected: boolean = false;
        for (let tool of tools) {
            if (tool.hovered) {
                selected = true;
                tool.selected = true;
            } else { tool.selected = false; }
        }
        if (selected) { evt.consume(); }
    }
    
    const onMouseMoved = (args: any) => {
        const candidates = tools.filter(
            t => t.selectionEquation !== undefined
        ).map(tool => { return { 
            // This is impossible but the compiler didn't detect it
            d: tool.selectionEquation?.distance(args.pos),
            tool: tool
            // @ts-ignore
        };}).filter(t => t.d <= ToolSelectionRadius)
            // @ts-ignore
            .sort((t1, t2) => t1.d - t2.d);
        
        // Hover the closest candidate or none if none is hoverable
        if (candidates.length === 0) { hover(undefined); }
        else { hover(candidates[0].tool); }
    }
    
    const draw = (ctx: CanvasRenderingContext2D, projection: Projection, selectedJoint: Joint|undefined) => {
        for (const tool of tools) { tool.draw(ctx, projection, selectedJoint); }
    }
    
    const canvasIsLoaded = canvas !== undefined;
    useEffect(() => {
        canvas?.addListener("mouseMove", onMouseMoved);
        canvas?.addListener("mouseClick", {
            priority: 0,
            callback: select
        });
        
    }, [ canvasIsLoaded ])
    
    return { draw }
}

export default useControlTools;