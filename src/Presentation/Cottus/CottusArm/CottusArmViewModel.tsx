import {useEffect, useRef, useState} from "react";
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

const canvasWidth: number = 700;
const canvasHeight: number = 700;

const UseCase = new CottusArmUseCase( new CottusArmRepositoryImpl(new CottusArmDatasourceAPIImpl()) );

let prev = Date.now();

export default function useCottusArmViewModel() {
    
    // Update the arm's state
    const cottusArmRef = useRef<CottusArm>();
    const [ cottusArm, setCottusArm ] = useState<CottusArm>();
    
    const dtRef = useRef<number>(0);
    
    const [ canvas, setCanvas ] = useState<Canvas>();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const projectionRef = useRef<Projection>();
    const { projection } = useCanvasNavigation(canvas, canvasWidth, canvasHeight, dtRef);
    useEffect(() => { projectionRef.current = projection; }, [ projection ])
    
    const { selectedJoint, hoveredJoint} = useJointSelection(canvas, cottusArmRef, projectionRef);
    const { draw: drawTools } = useControlTools(canvas, cottusArmRef);

    // On each redraw, update dt
    const curr = Date.now();
    dtRef.current = (curr - prev) / 1000;
    prev = curr;
    
    // Execute once, on component mount
    useEffect(() => {
        if (canvasRef.current === null) { return; }
        
        // TODO CHECK Note to self : Putting this out of the useEffect hook like in the help page
        // is a stupid move because it subscribes every time the components renders and
        // that might be why the page starts freezing after a while
        UseCase.subscribe((data) => { 
            setCottusArm(data)
            cottusArmRef.current = data;
        });
        const c = new Canvas(canvasRef.current);
        setCanvas(c)
    }, [])

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
        drawArm(ctx, cottusArm, projection, hoveredJoint, selectedJoint);

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
            0, canvasHeight/2,
            canvasWidth/2, canvasHeight/2);

        let animationFrameId: number;
        
        const render = () => {
            draw(context);
            animationFrameId = window.requestAnimationFrame(render);
        }
        render();
        
        return () => { window.cancelAnimationFrame(animationFrameId); }
    }, [canvas, draw]);
    
    return { cottusArm, canvasWidth, canvasHeight, canvasRef };
}