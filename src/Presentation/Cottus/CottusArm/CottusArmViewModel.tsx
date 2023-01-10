import {MutableRefObject, useEffect, useRef, useState} from "react";
import {CottusArm} from "../../../Domain/Models/CottusArm";
import {CottusArmRepositoryImpl} from "../../../Data/Repository/CottusArmRepositoryImpl";
import CottusArmDatasourceAPIImpl from "../../../Data/Datasource/API/CottusArmDatasourceAPIImpl";
import CottusArmUseCase from "../../../Domain/UseCases/CottusArmUseCase";
import useCanvasNavigation from "./canvas/Hooks/UseCanvasNavigation";
import useJointSelection from "./canvas/Hooks/UseJointSelection";
import useControlTools from "./canvas/Hooks/UseControlTools";
import Canvas from "../../UIBase/Canvas";
import Color from "../../Utils/Color";
import {drawReferential} from "./canvas/Drawers/ReferentialDrawer";
import {drawArm} from "./canvas/Drawers/JointDrawer";
import {Projection} from "../../../Domain/Models/Maths/Projection/Projection";
import drawEndEffector from "./canvas/Drawers/EndEffectorDrawer";
import CottusArmDatasource from "../../../Data/Datasource/CottusArmDatasource";

const canvasWidth: number = 700;
const canvasHeight: number = 700;

let prev = Date.now();

export default function useCottusArmViewModel(
    datasource: CottusArmDatasource,
    armRef: MutableRefObject<CottusArm|undefined>
) {
    
    // Update the arm's state
    const [ useCase, setUseCase ] = useState<CottusArmUseCase>();
    const [ drivenArm, setDrivenArm ] = useState<CottusArm>();
    const [ cottusArm, setCottusArm ] = useState<CottusArm>();
    
    const dtRef = useRef<number>(0);
    
    const [ canvas, setCanvas ] = useState<Canvas>();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const projectionRef = useRef<Projection>();
    const { projection, setProjectionType, projectionType } = useCanvasNavigation(canvas, canvasWidth, canvasHeight, dtRef);
    useEffect(() => { projectionRef.current = projection; }, [ projection ])
    
    const { selectedJoint, hoveredJoint} = useJointSelection(canvas, armRef, projectionRef);
    const { draw: drawTools, editMode, setEditMode } = useControlTools(canvas, armRef);

    // On each redraw, update dt
    const curr = Date.now();
    dtRef.current = (curr - prev) / 1000;
    prev = curr;
    
    useEffect(() => {
        setUseCase( new CottusArmUseCase(new CottusArmRepositoryImpl(datasource)) );
    }, [datasource])
    
    // Execute once, on component mount
    useEffect(() => {
        if (canvasRef.current === null) { return; }
        const c = new Canvas(canvasRef.current);
        setCanvas(c)
    }, [])
    
    useEffect(() => {
        if (useCase !== undefined) {
            useCase.subscribe((data) => {
                const [ simulatedArm, drivenArm ] = data;
                
                setDrivenArm(drivenArm);
                
                setCottusArm(simulatedArm)
                armRef.current = simulatedArm;
            });
        }
    }, [ useCase ])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const draw = (ctx: CanvasRenderingContext2D) => {

        // Redraw
        ctx.fillStyle = new Color(80, 80, 80).toRgbString();
        ctx.fillRect(-1, -1, 2, 2);

        if (projection === undefined) { return; }
        ctx.lineWidth = 1/Math.max(canvasWidth, canvasHeight);

        // Draw the referential for the world space
        drawReferential(ctx, projection);

        // If the arm data isn't available, don't draw it
        drawArm(ctx, cottusArm, projection, false, hoveredJoint, selectedJoint);
        drawArm(ctx, drivenArm, projection, true);

        drawEndEffector(ctx, projection, cottusArm?.endEffector);

        // Draw the tools
        drawTools(ctx, projection, cottusArm?.joints.filter(j => j.name === selectedJoint)[0])
    }

    // Execute once every frame drawn on the canvas
    useEffect(() => {
        if (canvas === undefined) { return; }
        const context = canvas.getCtx();
        if (context === undefined) { return; }
        
        context.setTransform(
            canvasWidth/2, 0,
            0, -canvasHeight/2,
            canvasWidth/2, canvasHeight/2);

        let animationFrameId: number;
        
        const render = () => {
            draw(context);
            animationFrameId = window.requestAnimationFrame(render);
        }
        render();
        
        return () => { window.cancelAnimationFrame(animationFrameId); }
    }, [canvas, draw]);
    
    return {
        cottusArm, canvasWidth, canvasHeight, canvasRef,
        projectionType, setProjectionType,
        editMode, setEditMode
    };
}