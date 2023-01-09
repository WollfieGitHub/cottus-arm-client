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
import React from "react";

const DefaultPos: Vector3D = Vector3D.Zero;

export const LineToAnimationView = () => {
    
    const { 
        setPosition, position,
        setRelative, setTime, animation
    } = useViewModel();
    
    
    return (<div className={"line-to-animation"} style={{width: '100%'}}>
        { /* Doesn't work */ }
        <div className={'duration'} style={{marginBottom: 10}}>
            <TextField label={'Duration'}
                       InputProps={{endAdornment: <InputAdornment position="end">sec</InputAdornment>,}}
            />
        </div>
        <Divider />
        <div className={'position'} style={{marginTop: 10}}>
            <PositionSpecificationView setPos={setPosition} pos={position} defaultPos={DefaultPos} />
            <Stack direction={'row'} spacing={1} alignItems={'center'} justifyContent={'flex-start'}>
                <Typography>Absolute</Typography>
                <Switch defaultChecked />
                <Typography>Relative</Typography>
            </Stack>
        </div>
    </div>)
}