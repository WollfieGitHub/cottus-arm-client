import {useViewModel} from "../../../../Presentation/Cottus/CottusArm/Animation/LineToAnimationViewModel";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary, Divider,
    FormControlLabel,
    FormGroup, InputAdornment, Stack,
    Switch, TextField,
    Typography
} from "@mui/material";
import {ExpandMore} from "@mui/icons-material"
import {PositionSpecificationView} from "../../CottusArm/PositionSpecificationView";
import {Vector3D} from "../../../../Domain/Models/Maths/Vector3D";
import React, {ChangeEvent, useEffect} from "react";
import {ArmAnimation} from "../../../../Domain/Models/Animation/ArmAnimation";

export const LineToAnimationView = (props: {
    position: Vector3D|undefined,
    setAnimation: (animation: ArmAnimation) => void
}) => {
    const { position: currentPosition } = props;
    
    const { 
        setPosition, position,
        setRelative, setTime
    } = useViewModel(props.setAnimation);
    
    // When the position of the end effector captured by the parenting
    // view changes, change the position
    useEffect(() => {
        if (currentPosition === undefined) { return; }
        
        setPosition(currentPosition);
    }, [currentPosition])

    const handleRelativeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRelative(e.target.value === 'true');
    }
    
    const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTime(parseFloat(e.target.value));
    }

    return (<div className={"line-to-animation"} style={{width: '100%'}}>
        { /* Doesn't work */ }
        <div className={'duration'} style={{marginBottom: 10}}>
            <TextField label={'Duration'} onChange={handleTimeChange}
                       InputProps={{endAdornment: <InputAdornment position="end">sec</InputAdornment>,}}
            />
        </div>
        <Divider />
        <div className={'position'} style={{marginTop: 10}}>
            <PositionSpecificationView setPos={setPosition} pos={position} />
            <Stack direction={'row'} spacing={1} alignItems={'center'} justifyContent={'flex-start'}>
                <Typography>Absolute</Typography>
                <Switch defaultChecked onChange={handleRelativeChange}/>
                <Typography>Relative</Typography>
            </Stack>
        </div>
    </div>)
}