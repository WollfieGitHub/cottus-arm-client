import {Vector3D} from "../../../Domain/Models/Maths/Vector3D";
import {Axis3D} from "../../../Domain/Models/Maths/Axis3D";
import React, {ChangeEvent} from "react";
import {Box, InputAdornment, TextField, Typography} from "@mui/material";

export const PositionSpecificationView = ({setPos, pos, disabled, label}: { 
    setPos: (rot: Vector3D) => void, pos: Vector3D, disabled?: boolean,
    label: string,
}) => {

    const handleChange = (axis: Axis3D, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.target.value === '-') { return; } // Started building a negative number, don't change anything
        
        setPos(pos.withCoordinate(axis.id, parseInt(event.target.value)));
    }

    return (<div>
        <Typography variant={'subtitle1'}>{ label }</Typography>
        <Box sx={{display: 'flex', flexDirection: 'row'}}>
            <TextField
                label="X" id="outlined-start-adornment" sx={{m: 1, width: '12ch'}}
                InputProps={{endAdornment: <InputAdornment position="end">mm</InputAdornment>,}}
                onChange={event => handleChange(Axis3D.X, event)} 
                value={pos.x} disabled={disabled}
            />
            <TextField
                label="Y" id="outlined-start-adornment" sx={{m: 1, width: '12ch'}}
                InputProps={{endAdornment: <InputAdornment position="end">mm</InputAdornment>,}}
                onChange={event => handleChange(Axis3D.Y, event)}
                value={pos.y} disabled={disabled}
            />
            <TextField
                label="Z" id="outlined-start-adornment" sx={{m: 1, width: '12ch'}}
                InputProps={{endAdornment: <InputAdornment position="end">mm</InputAdornment>,}}
                onChange={event => handleChange(Axis3D.Z, event)}
                value={pos.z} disabled={disabled}
            />
        </Box>
    </div>)
}