import {useEffect, useState} from "react";
import {LineToAnimation} from "../../../../Domain/Models/Animation/LineToAnimation";
import {Vector3D} from "../../../../Domain/Models/Maths/Vector3D";
import {ArmAnimation} from "../../../../Domain/Models/Animation/ArmAnimation";

export const useViewModel = (
    setAnimation: (animation: ArmAnimation) => void
) => {
    
    const [ time, setTime ] = useState<number>()
    const [ relative, setRelative ] = useState<boolean>(false)
    const [ position, setPosition ] = useState<Vector3D>(Vector3D.Zero)
    
    // Update the animation
    useEffect(() => {
        if (time !== undefined && relative !== undefined && position !== undefined)
        setAnimation({
            relative: relative,
            time: time,
            position: position
        } as LineToAnimation)
    }, [time, relative, position, setAnimation])
    
    return { setTime, setRelative, setPosition, position };
}