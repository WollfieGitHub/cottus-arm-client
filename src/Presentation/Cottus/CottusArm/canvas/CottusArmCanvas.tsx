import {CottusArm} from "../../../../Domain/Models/CottusArm";
import {useEffect, useRef, useState} from "react";
import {drawReferential} from "./ReferentialDrawer";
import Color from "../../../utils/Color";
import {drawArm} from "./ArticulationDrawer";
import useCanvasNavigation from "../../../../Domain/UseCases/CanvasNavigationUseCase";

const canvasWidth: number = 700;
const canvasHeight: number = 700;

const CottusArmCanvas = ({ cottusArm }: { cottusArm: CottusArm | undefined, }) => {
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { projection, handleMouseEvt, handleScroll } = useCanvasNavigation(canvasRef, canvasWidth, canvasHeight);
    
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
        context.fillRect(-1, -1, 2, 2);
        
        context.lineWidth = 1/Math.max(canvasWidth, canvasHeight);

        // Draw the referential for the world space
        drawReferential(context, projection);
        
        // If the arm data isn't available, don't draw it
        if (cottusArm !== undefined) { drawArm(context, cottusArm, projection); }  
        
    }, [ projection, cottusArm ])

    
    
    return (<div className={"cottus-arm-canvas"}>
        <canvas 
            onWheelCapture={handleScroll}
            onMouseDownCapture={handleMouseEvt} onMouseUpCapture={handleMouseEvt} 
            onMouseMoveCapture={handleMouseEvt}
            width={canvasWidth} 
            height={canvasHeight} 
            ref={canvasRef}
        />
    </div>);
}

export default CottusArmCanvas;

