import {useEffect, useState} from "react";
import {LineToAnimation} from "../../../../../Domain/Models/Animation/Prebuilt/LineToAnimation";
import {Vector3D} from "../../../../../Domain/Models/Maths/Vector3D";
import {AnimationPrimitive} from "../../../../../Domain/Models/Animation/AnimationPrimitive";

export const useViewModel = (
    setAnimation: (animation: AnimationPrimitive) => void
) => {
    
    const [ time, setTime ] = useState<number>()
    const [ relative, setRelative ] = useState<boolean>(false)
    const [ position, setPosition ] = useState<Vector3D>(Vector3D.Zero)
    
    // Update the animation
    useEffect(() => {
        if (time !== undefined && relative !== undefined && position !== undefined)
        setAnimation(new LineToAnimation(relative, position, time));
    }, [time, relative, position, setAnimation])
    
    return { setTime, setRelative, setPosition, position };
}