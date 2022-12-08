import {CottusArm} from "../../../../Domain/Models/CottusArm";
import {useEffect, useRef, useState} from "react";
import {drawReferential} from "./ReferentialDrawer";
import {Vector3D} from "../../../../Domain/Models/maths/Vector3D";
import Color from "../../../utils/Color";
import {Projection} from "../../../../Domain/Models/maths/projection/Projection";
import PerspectiveProjection from "../../../../Domain/Models/maths/projection/PerspectiveProjection";
import {Slider} from "@mui/material";
import {drawArm} from "./ArticulationDrawer";

const canvasWidth: number = 700;
const canvasHeight: number = 700;

const createProjection = (rotX: number, rotZ: number): Projection => {
    return new PerspectiveProjection(
        new Vector3D(1000,1000, 1000),
        new Vector3D(rotX+2*Math.PI/3,0, rotZ-Math.PI/4),
        100.0, 0.1, 70,
        canvasWidth/canvasHeight
    )
}

const CottusArmCanvas = ({ cottusArm }: { cottusArm: CottusArm | undefined, }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const [ rotX, setRotX ] = useState(0);
    const [ rotZ, setRotZ ] = useState(0);
    const [ projection, setProjection ] = useState<Projection>();
    
    useEffect(() => {
        if (projection === undefined) { return; }
        const canvas = canvasRef.current;

        if (canvas === null) { return; }
        const context = canvas.getContext("2d");
        
        if (context === null) { return; }

        context.setTransform(
            canvasWidth/2, 0,
            0, canvasHeight/2,
            canvasWidth/2, canvasHeight/2
        );
        
        context.fillStyle = new Color(80, 80, 80).toRgbString();
        context.fillRect(
            -1, -1,
            2, 2);
        
        context.lineWidth = 1/Math.max(canvasWidth, canvasHeight);

        // Draw the referential for the world space
        drawReferential(context, projection);
        
        // If the arm data isn't available, don't draw it
        if (cottusArm !== undefined) { drawArm(context, cottusArm, projection); }  
        
    }, [ projection, cottusArm ])

    // Recompute the projection each time the rotX or rotZ changes
    useEffect(() => { setProjection(createProjection(rotX, rotZ)); }, [rotX, rotZ])
    
    return (
        <div className={"cottus-arm-canvas"}>
            <canvas width={canvasWidth} height={canvasHeight} ref={canvasRef}/>
        </div>);
}

export default CottusArmCanvas;

