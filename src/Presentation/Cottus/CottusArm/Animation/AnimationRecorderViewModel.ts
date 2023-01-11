import {MutableRefObject, useEffect, useState} from "react";
import {CottusArm} from "../../../../Domain/Models/CottusArm";
import {Vector3D} from "../../../../Domain/Models/Maths/Vector3D";
import {AnimationPrimitive} from "../../../../Domain/Models/Animation/AnimationPrimitive";
import {AnimationComposition} from "../../../../Domain/Models/Animation/Prebuilt/AnimationComposition";

const useViewModel = (
    armRef: MutableRefObject<CottusArm|undefined>,
    setAnimationToPreview: (preview?: AnimationPrimitive) => void,
) => {
    const [ recording, setRecording ] = useState(false);
    const [ name, setName ] = useState('');
    const [ animation, setAnimation ] = useState<AnimationComposition>(new AnimationComposition([]))
    const [ preview, setPreview ] = useState<AnimationPrimitive>()
    
    const [ currentFramePosition, setCurrentFramePosition ] = useState(Vector3D.Zero);
    
    const remove = (animationIndex: number) => {
        setAnimation(a => {
            const animations = [...a.animations] // Copy array
            animations.splice(animationIndex, 1);
            return new AnimationComposition([...animations]);
        })
    }
    const undoLast = () => { // I'm not sure remove(length-1) would have worked because of states in react
        setAnimation(a => {
            const animations = [...a.animations] // Copy array
            animations.splice(animations.length-1, 1);
            return new AnimationComposition(animations);
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
        
        setAnimation(a => {
            const animations = [...a.animations] // Copy array
            animations.push(preview);
            return new AnimationComposition(animations);
        })
    }
    
    useEffect(() => {
        if (preview === undefined) { return; }
        
        const animations = [...animation.animations] // Copy array
        animations.push(preview);
        const toPreview: AnimationPrimitive = new AnimationComposition(animations)
        
        setAnimationToPreview(toPreview)
    }, [preview]);
    
    return { 
        recording, setRecording,
        name, setName,
        undoLast, remove, captureFrame,
        currentFramePosition, setPreview,
        addAnimation, animation
    }
}

export default useViewModel;