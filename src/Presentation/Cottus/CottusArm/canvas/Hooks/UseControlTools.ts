import RotateTool from "../../../../Tools/RotateTool";
import {Axis3D} from "../../../../../Domain/Models/maths/Axis3D";
import MoveTool from "../../../../Tools/MoveTool";
import {Vector2D} from "../../../../../Domain/Models/maths/Vector2D";
import {useState} from "react";
import {ControlTool} from "../../../../Tools/ControlTool";
import {Projection} from "../../../../../Domain/Models/maths/projection/Projection";
import {Joint} from "../../../../../Domain/Models/Joint";

// Tools to rotate a node
const rToolX: RotateTool = new RotateTool(100, Axis3D.X);
const rToolY: RotateTool = new RotateTool(100, Axis3D.Y);
const rToolZ: RotateTool = new RotateTool(100, Axis3D.Z);

// Tools to move a node
const mToolX: MoveTool = new MoveTool(150, Axis3D.X);
const mToolY: MoveTool = new MoveTool(150, Axis3D.Y);
const mToolZ: MoveTool = new MoveTool(150, Axis3D.Z);

const tools = [ rToolX, rToolY, rToolZ, mToolX, mToolY, mToolZ ];

const useControlTools = () => {
    
    // Selects a tool and notify it has been selected
    const select = () => { for (let tool of tools) { tool.selected = tool.hovered; } }

    // Hover a tool and notify it has been hovered
    const hover = (tool: ControlTool|undefined) => {
        for (let t of tools) { if (tool !== t) { t.hovered = false; } }
        if (tool !== undefined) { tool.hovered = true; }
    }
    
    const onMouseMoved = (x: number, y: number) => {
        
        const candidates = tools.filter(
            t => t.selectionEquation !== undefined
        ).map(tool => {return { 
            // This is impossible but the compiler didn't detect it
            d: tool.selectionEquation === undefined
                ? 9999999 
                : tool.selectionEquation?.distance(new Vector2D(x, y)),
            tool: tool
        };}).sort((t1, t2) => t1.d - t2.d);
        
        // Hover the closest candidate or none if none is hoverable
        if (candidates.length === 0) { hover(undefined); }
        else { hover(candidates[0].tool); }
    }
    
    const draw = (ctx: CanvasRenderingContext2D, projection: Projection, selectedJoint: Joint|undefined) => {
        for (const tool of tools) { tool.draw(ctx, projection, selectedJoint); }
    }
    
    return { onMouseMoved, onMouseClicked: select, draw }
}

export default useControlTools;