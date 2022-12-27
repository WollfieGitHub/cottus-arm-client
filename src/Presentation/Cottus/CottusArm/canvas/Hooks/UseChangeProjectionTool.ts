import {RefObject, useEffect} from "react";
import {ProjectionType} from "../../../../../Domain/Models/Maths/Projection/Projection";
import ChangeProjectionTool from "../../../../Tools/ChangeProjectionTool";

const changeProjectionTool: ChangeProjectionTool = new ChangeProjectionTool();

export const UseChangeProjectionTool = (
    setProjection: (p: ProjectionType) => void
) => {
    
    // Initialize the setProjection function onClick of the button
    useEffect(() => {
        changeProjectionTool.onClick = () => {
            setProjection(ProjectionType.Orthographic);
        };
    })
    
    const handleMouseClick = (x: number, y: number) => {
        
        if (changeProjectionTool.isHovering(x, y)) {
            
        }
    }
}