import {MutableRefObject, useState} from "react";
import {CottusArm} from "../../../../Domain/Models/CottusArm";
import {Vector3D} from "../../../../Domain/Models/Maths/Vector3D";
import {ArmAnimation} from "../../../../Domain/Models/Animation/ArmAnimation";

const useViewModel = (
    armRef: MutableRefObject<CottusArm|undefined>
) => {
    const [ recording, setRecording ] = useState(false);
    const [ name, setName ] = useState('');
    const [ animations, setAnimations ] = useState<ArmAnimation[]>([])
    const [ preview, setPreview ] = useState<ArmAnimation>()
    
    const [ currentFramePosition, setCurrentFramePosition ] = useState(Vector3D.Zero);
    
    const remove = (animationIndex: number) => {
        setAnimations(a => {
            const animations = [...a] // Copy array
            animations.splice(animationIndex, 1);
            return animations;
        })
    }
    const undoLast = () => { // I'm not sure remove(length-1) would have worked because of states in react
        setAnimations(a => {
            const animations = [...a] // Copy array
            animations.splice(animations.length-1, 1);
            return animations;
        })
    }
    
    // Set the current position parameter of the animation as the current position of the end effector
    const captureFrame = () => {
        if (armRef.current === undefined) { return; } 
        
        console.log("Position set")
        setCurrentFramePosition(armRef.current.endEffector.globalPosition);
    }
    
    const addAnimation = () => {
        if (preview === undefined) { throw new Error("The preview shouldn't be empty when clicked on add Animation"); }
        
        setAnimations(a => {
            const animations = [...a] // Copy array
            animations.push(preview);
            return animations;
        })
    }
    
    return { 
        recording, setRecording,
        name, setName,
        undoLast, remove, captureFrame,
        currentFramePosition, setPreview,
        addAnimation
    }
}

export default useViewModel;