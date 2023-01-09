import {Vector3D} from "../../../Domain/Models/Maths/Vector3D";
import {Axis3D} from "../../../Domain/Models/Maths/Axis3D";
import React, {ChangeEvent} from "react";
import {Box, InputAdornment, TextField, Typography} from "@mui/material";

export const PositionSpecificationView = ({setPos, pos, defaultPos}: { setPos: (rot: Vector3D) => void, pos: Vector3D, defaultPos: Vector3D }) => {

    const handleChange = (axis: Axis3D, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPos(pos.withCoordinate(axis.id, parseInt(event.target.value)));
    }

    return (<div>
        <Typography variant={'subtitle1'}>3D Position</Typography>
        <Box sx={{display: 'flex', flexDirection: 'row'}}>
            <TextField
                label="X" id="outlined-start-adornment" sx={{m: 1, width: '12ch'}}
                InputProps={{endAdornment: <InputAdornment position="end">mm</InputAdornment>,}}
                onChange={event => handleChange(Axis3D.X, event)} defaultValue={defaultPos.x}
            />
            <TextField
                label="Y" id="outlined-start-adornment" sx={{m: 1, width: '12ch'}}
                InputProps={{endAdornment: <InputAdornment position="end">mm</InputAdornment>,}}
                onChange={event => handleChange(Axis3D.Y, event)} defaultValue={defaultPos.y}
            />
            <TextField
                label="Z" id="outlined-start-adornment" sx={{m: 1, width: '12ch'}}
                InputProps={{endAdornment: <InputAdornment position="end">mm</InputAdornment>,}}
                onChange={event => handleChange(Axis3D.Z, event)} defaultValue={defaultPos.z}
            />
        </Box>
    </div>)
}