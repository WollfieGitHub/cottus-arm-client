import {useEffect, useState} from "react";
import {LineToAnimation} from "../../../../Domain/Models/Animation/LineToAnimation";
import {Vector3D} from "../../../../Domain/Models/Maths/Vector3D";

export const useViewModel = () => {
    const [ animation, setAnimation ] = useState<LineToAnimation>();
    
    const [ time, setTime ] = useState<number>()
    const [ relative, setRelative ] = useState<boolean>()
    const [ position, setPosition ] = useState<Vector3D>()
    
    // Update the animation
    useEffect(() => {
        if (time !== undefined && relative !== undefined && position !== undefined)
        setAnimation({ time, relative, position })
    }, [time, relative, position])
    
    return { animation, setTime, setRelative, setPosition };
}