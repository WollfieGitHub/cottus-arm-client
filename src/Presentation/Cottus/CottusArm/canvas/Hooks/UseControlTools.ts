import RotateTool from "../../../../Tools/RotateTool";
import {Axis3D} from "../../../../../Domain/Models/Maths/Axis3D";
import MoveTool from "../../../../Tools/MoveTool";
import {MutableRefObject, RefObject, useEffect} from "react";
import {ControlTool} from "../../../../Tools/ControlTool";
import {Projection} from "../../../../../Domain/Models/Maths/Projection/Projection";
import {Joint} from "../../../../../Domain/Models/Joint";
import Canvas from "../../../../UIBase/Canvas";
import {CanvasButtonEvent, CanvasClickEvent, CanvasMoveEvent} from "../../../../UIBase/CanvasEvent";
import {CottusArm} from "../../../../../Domain/Models/CottusArm";

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

const useControlTools = (
    canvas: Canvas|undefined,
    arm: MutableRefObject<CottusArm|undefined>
) => {
    
    // Selects a tool and notify it has been selected
    const select = (evt: CanvasButtonEvent) => { 
        const { btnDown, button } = evt;
        if (button === 2) { return; }
        
        for (let tool of tools) {
            if (btnDown && tool.hovered) {
                tool.onSelectBegin(evt.pos);
                evt.consume();
                
            } else if (!btnDown && tool.selected){
                tool.onSelectEnd(evt.pos);
                evt.consume();
            }
        }
    }
    
    const onMouseClicked = (evt: CanvasClickEvent) => {
        // If one of the tool is selected and there is a click, let the "select" method handle it
        if (tools.some(_ => _.selected)) { evt.consume(); }
    }
    
    const onMouseMoved = (evt: CanvasMoveEvent) => {
        // If any tool is selected, update it
        let selectedTool: ControlTool | undefined;
        if (
            (selectedTool = tools.find(_ => _.selected)) !== undefined && arm.current !== undefined
        ) { 
            selectedTool.onSelectUpdate(evt.pos, arm.current);
            return; 
        }
        
        // Otherwise, find a tool which is hovered
        const candidates = tools
            .filter(t => t.selectionEquation !== undefined)
            .map(tool => { return {d: tool.selectionEquation?.distance(evt.pos), tool: tool};})
            // @ts-ignore : Compiler is not happy about selectionEquation being undefined
            .filter(t => t.d <= ToolSelectionRadius)
            // @ts-ignore : Compiler is not happy about selectionEquation being undefined
            .sort((t1, t2) => t1.d - t2.d);
        
        // Hover the closest candidate or none if none is hoverable
        if (candidates.length === 0) { hover(undefined); }
        else { hover(candidates[0].tool); }
    }
    
    // Draw all the tools
    const draw = (ctx: CanvasRenderingContext2D, projection: Projection, selectedJoint: Joint|undefined) => {
        for (const tool of tools) { tool.draw(ctx, projection, selectedJoint); }
    }
    
    const canvasIsLoaded = canvas !== undefined;
    useEffect(() => {
        canvas?.addListener("canvasMove", onMouseMoved);
        canvas?.addListener('canvasButton', select, 0);
        canvas?.addListener('canvasClick', onMouseClicked, 0);
    }, [ canvasIsLoaded ])
    
    return { draw }
}

export default useControlTools;