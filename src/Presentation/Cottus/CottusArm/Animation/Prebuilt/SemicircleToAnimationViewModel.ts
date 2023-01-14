import {AnimationPrimitive} from "../../../../../Domain/Models/Animation/AnimationPrimitive";
import {useEffect, useState} from "react";
import {Vector3D} from "../../../../../Domain/Models/Maths/Vector3D";
import {LineToAnimation} from "../../../../../Domain/Models/Animation/Prebuilt/LineToAnimation";
import {Axis3D} from "../../../../../Domain/Models/Maths/Axis3D";
import {SemiCircleToAnimation} from "../../../../../Domain/Models/Animation/Prebuilt/SemiCircleToAnimation";

export const useViewModel = (
    setAnimation: (animation: AnimationPrimitive) => void
) => {

    const [ time, setTime ] = useState<number>(0)
    const [ relative, setRelative ] = useState<boolean>(false)
    const [ position, setPosition ] = useState<Vector3D>(Vector3D.Zero)
    const [ angleDeg, setAngleDeg ] = useState<number>(0);
    const [ circleDirection, setCircleDirection ] = useState<Vector3D>(Axis3D.X.unitVector);
    const [ normalizedCircleDirection, setNormalizedCircleDirection ] = useState<Vector3D>(Axis3D.X.unitVector);

    // Update the animation
    useEffect(() => {
        setAnimation(new SemiCircleToAnimation(relative, time, position, angleDeg, normalizedCircleDirection));
    }, [time, relative, position, angleDeg, normalizedCircleDirection, setAnimation])
    
    const setDir = (dir: Vector3D) => {
        setCircleDirection(dir);
        setNormalizedCircleDirection(dir.normalized);
    }

    return { 
        setTime, setRelative,
        setPosition, position,
        setCircleDirection: setDir, circleDirection,
        setAngleDeg
    };
}