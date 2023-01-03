
// TEMP

import {Box, Button, Card, InputAdornment, TextField, Typography} from "@mui/material";
import {Axis3D} from "../../../Domain/Models/Maths/Axis3D";
import React, {ChangeEvent, useState} from "react";
import {Vector3D} from "../../../Domain/Models/Maths/Vector3D";
import {
    AbsoluteEndEffectorSpecificationAPIEntity
} from "../../../Data/Datasource/API/Entity/Specification/AbsoluteEndEffectorSpecificationAPIEntity";
import {fromObject as fromVector} from "../../../Data/Datasource/API/Entity/Vector3DAPIEntity";

const PositionSpecification = ({setPos, pos} : {setPos: (rot: Vector3D) => void, pos: Vector3D}) => {
    
    const handleChange = (axis: Axis3D, event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        setPos(pos.withCoordinate(axis.id, parseInt(event.target.value)));
    }
    
    return (<div>
        <Typography variant={"h5"}>3D Position</Typography>
        <Box sx={{display: 'flex', flexDirection: 'row'}}>
            <TextField
                label="X Coordinate" id="outlined-start-adornment" sx={{ m: 1, width: '25ch' }}
                InputProps={{startAdornment: <InputAdornment position="start">x</InputAdornment>,}}
                onChange={event => handleChange(Axis3D.X, event)} defaultValue={0}
            />
            <TextField
                label="Y Coordinate" id="outlined-start-adornment" sx={{ m: 1, width: '25ch' }}
                InputProps={{startAdornment: <InputAdornment position="start">y</InputAdornment>,}}
                onChange={event => handleChange(Axis3D.Y, event)} defaultValue={0}
            />
            <TextField
                label="Z Coordinate" id="outlined-start-adornment" sx={{ m: 1, width: '25ch' }}
                InputProps={{startAdornment: <InputAdornment position="start">z</InputAdornment>,}}
                onChange={event => handleChange(Axis3D.Z, event)} defaultValue={0}
            />
        </Box>
    </div>)
}

const RotationSpecification = ({setRot, rot} : {setRot: (rot: Vector3D) => void, rot: Vector3D}) => {

    const handleChange = (axis: Axis3D, event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        setRot(rot.withCoordinate(axis.id, parseInt(event.target.value) / 180 * Math.PI));
    }

    return (<div>
        <Typography variant={"h5"}>Euler Angles</Typography>
        <Box sx={{display: 'flex', flexDirection: 'row'}}>
            <TextField
                label="Yaw" id="outlined-start-adornment" sx={{ m: 1, width: '25ch' }}
                InputProps={{startAdornment: <InputAdornment position="start">x</InputAdornment>,}}
                onChange={event => handleChange(Axis3D.X, event)} defaultValue={0}
            />
            <TextField
                label="Pitch" id="outlined-start-adornment" sx={{ m: 1, width: '25ch' }}
                InputProps={{startAdornment: <InputAdornment position="start">y</InputAdornment>,}}
                onChange={event => handleChange(Axis3D.Y, event)} defaultValue={0}
            />
            <TextField
                label="Roll" id="outlined-start-adornment" sx={{ m: 1, width: '25ch' }}
                InputProps={{startAdornment: <InputAdornment position="start">z</InputAdornment>,}}
                onChange={event => handleChange(Axis3D.Z, event)} defaultValue={0}
            />
        </Box>
    </div>)
}

const SpecificationView = () => {
    
    const [ pos, setPos ] = useState(Vector3D.Zero);
    const [ rot, setRot ] = useState(Vector3D.Zero);
    
    const handleClick = () => {
        console.log(fromVector(rot));
        fetch('/api/arm-controller', {
            method: "POST",
            body: JSON.stringify({
                endEffectorAngle: 0,
                endEffectorPosition: fromVector(pos),
                endEffectorRotation: { eulerAngles: fromVector(rot) }
            } as AbsoluteEndEffectorSpecificationAPIEntity) as any,
            headers: new Headers({'content-type': 'application/json'})
        }).then();
    }
    
    return (<Card sx={{margin: '5px', padding: '10px'}}>
        <PositionSpecification setPos={setPos} pos={pos} />
        <RotationSpecification setRot={setRot} rot={rot} />
        <Button variant={"contained"} onClick={handleClick}>Send</Button>
    </Card>)
}

export default SpecificationView;