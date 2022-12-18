import {useEffect, useRef, useState} from "react";
import {CottusArm} from "../../../Domain/Models/CottusArm";
import {CottusArmRepositoryImpl} from "../../../Data/Repository/CottusArmRepositoryImpl";
import CottusArmDatasourceAPIImpl from "../../../Data/Datasource/API/CottusArmDatasourceAPIImpl";
import CottusArmUseCase from "../../../Domain/UseCases/CottusArmUseCase";
import useCanvasNavigation from "./canvas/Hooks/UseCanvasNavigation";
import useJointSelection from "./canvas/Hooks/UseJointSelection";
import useControlTools from "./canvas/Hooks/UseControlTools";
import Canvas from "../../UIBase/Canvas";
import Color from "../../utils/Color";
import {drawReferential} from "./canvas/Drawers/ReferentialDrawer";
import {drawArm} from "./canvas/Drawers/JointDrawer";

const canvasWidth: number = 700;
const canvasHeight: number = 700;

const UseCase = new CottusArmUseCase( new CottusArmRepositoryImpl(new CottusArmDatasourceAPIImpl()) );

export default function useCottusArmViewModel() {
    
    // Update the arm's state
    const [ cottusArm, setCottusArm ] = useState<CottusArm>();
    const [ canvas, setCanvas ] = useState<Canvas>();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { projection, setProjection } = useCanvasNavigation(canvas, canvasWidth, canvasHeight);

    const { selectedJoint, hoveredJoint} = useJointSelection(canvas, cottusArm, projection);
    const { draw: drawTools } = useControlTools();
    
    // Execute once, on component mount
    useEffect(() => {
        if (canvasRef.current === null) { return; }
        
        // TODO CHECK Note to self : Putting this out of the useEffect hook like in the help page
        // is a stupid move because it subscribes every time the components renders and
        // that might be why the page starts freezing after a while
        UseCase.subscribe((data) => { setCottusArm(data); });
        setCanvas(new Canvas(canvasRef.current))
    }, [])

    // Execute once every frame drawn on the canvas
    useEffect(() => {
        if (canvas === undefined) { return; }
        const context = canvas.getCtx();
        if (context === undefined) { return; }

        context.setTransform(
            canvasWidth/2, 0,
            0, canvasHeight/2,
            canvasWidth/2, canvasHeight/2
        );

        const redraw = (ctx: CanvasRenderingContext2D) => {
            console.log("redraw");
            
            ctx.fillStyle = new Color(80, 80, 80).toRgbString();
            ctx.fillRect(-1, -1, 2, 2);

            if (projection === undefined) { return; }
            ctx.lineWidth = 1/Math.max(canvasWidth, canvasHeight);

            // Draw the referential for the world space
            drawReferential(ctx, projection);

            // If the arm data isn't available, don't draw it
            drawArm(ctx, cottusArm, projection, hoveredJoint, selectedJoint);

            // Draw the tools
            drawTools(ctx, projection, cottusArm?.joints.filter(j => j.name === selectedJoint)[0])
        }

        redraw(context);
    }, [canvas, canvasRef, cottusArm, drawTools, hoveredJoint, projection, selectedJoint]);
    
    return { cottusArm, canvasWidth, canvasHeight, canvasRef };
}