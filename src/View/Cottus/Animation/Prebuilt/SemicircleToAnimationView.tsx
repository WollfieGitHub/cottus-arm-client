import {Vector3D} from "../../../../Domain/Models/Maths/Vector3D";
import {AnimationPrimitive} from "../../../../Domain/Models/Animation/AnimationPrimitive";
import {useViewModel} from "../../../../Presentation/Cottus/CottusArm/Animation/Prebuilt/SemicircleToAnimationViewModel";
import React, {ChangeEvent, useEffect} from "react";
import {Divider, InputAdornment, Stack, Switch, TextField, Typography} from "@mui/material";
import {PositionSpecificationView} from "../../CottusArm/PositionSpecificationView";

const SemicircleToAnimationView = (props: {
    position: Vector3D|undefined,
    setAnimation: (animation: AnimationPrimitive) => void
}) => {
    const { position: currentPosition } = props;

    const {
        setPosition, position,
        setRelative, setTime,
        setAngleDeg, setCircleDirection, circleDirection
    } = useViewModel(props.setAnimation);

    // When the position of the end effector captured by the parenting
    // view changes, change the position
    useEffect(() => {
        if (currentPosition === undefined) { return; }

        setPosition(currentPosition);
    }, [ currentPosition ])

    const handleRelativeChange = (e: ChangeEvent<HTMLInputElement>) => { setRelative(e.target.checked); }
    const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => { setTime(parseFloat(e.target.value)); }
    const handleAngleChange = (e: ChangeEvent<HTMLInputElement>) => { setAngleDeg(parseFloat(e.target.value)); }

    return (<div className={"line-to-animation"} style={{width: '100%'}}>
        { /* Doesn't work */ }
        <div className={'duration'} style={{marginBottom: 10}}>
            <TextField label={'Duration'} onChange={handleTimeChange}
                       InputProps={{endAdornment: <InputAdornment position="end">sec</InputAdornment>,}}
            />
        </div>
        <div className={'duration'} style={{marginBottom: 10}}>
            <TextField label={'Angle'} onChange={handleAngleChange}
                       InputProps={{endAdornment: <InputAdornment position="end">deg</InputAdornment>,}}
            />
        </div>
        <Divider />
        <div className={'position'} style={{marginTop: 10}}>
            <PositionSpecificationView setPos={setPosition} pos={position} label={'End Position'} />
            <PositionSpecificationView setPos={setCircleDirection} pos={circleDirection} label={'Circle Direction'} />
            <Stack direction={'row'} spacing={1} alignItems={'center'} justifyContent={'flex-start'}>
                <Typography>Absolute</Typography>
                <Switch defaultChecked onChange={handleRelativeChange}/>
                <Typography>Relative</Typography>
            </Stack>
        </div>
    </div>)
}

export default SemicircleToAnimationView;