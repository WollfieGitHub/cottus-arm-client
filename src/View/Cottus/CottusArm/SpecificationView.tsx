
// TEMP

import {Box, Button, Card, InputAdornment, TextField, Typography} from "@mui/material";
import {Axis3D} from "../../../Domain/Models/Maths/Axis3D";
import React, {ChangeEvent, useState} from "react";
import {Vector3D} from "../../../Domain/Models/Maths/Vector3D";
import {
    AbsoluteEndEffectorSpecificationAPIEntity
} from "../../../Data/Datasource/API/Entity/Specification/AbsoluteEndEffectorSpecificationAPIEntity";
import {fromObject as fromVector} from "../../../Data/Datasource/API/Entity/Vector3DAPIEntity";
import {toDegrees} from "../../../Domain/Models/Maths/MathUtils";

const DefaultPos: Vector3D = new Vector3D(200, 200, 150);
const DefaultOrientation: Vector3D = new Vector3D(0, Math.PI/2.0, 0);

const PositionSpecification = ({setPos, pos} : {setPos: (rot: Vector3D) => void, pos: Vector3D}) => {

    const handleChange = (axis: Axis3D, event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        setPos(pos.withCoordinate(axis.id, parseInt(event.target.value)));
    }

    return (<div>
        <Typography variant={"h5"}>3D Position</Typography>
        <Box sx={{display: 'flex', flexDirection: 'row'}}>
            <TextField
                label="X Coordinate" id="outlined-start-adornment" sx={{ m: 1, width: '12ch' }}
                InputProps={{endAdornment: <InputAdornment position="end">mm</InputAdornment>,}}
                onChange={event => handleChange(Axis3D.X, event)} defaultValue={DefaultPos.x}
            />
            <TextField
                label="Y Coordinate" id="outlined-start-adornment" sx={{ m: 1, width: '12ch' }}
                InputProps={{endAdornment: <InputAdornment position="end">mm</InputAdornment>,}}
                onChange={event => handleChange(Axis3D.Y, event)} defaultValue={DefaultPos.y}
            />
            <TextField
                label="Z Coordinate" id="outlined-start-adornment" sx={{ m: 1, width: '12ch' }}
                InputProps={{endAdornment: <InputAdornment position="end">mm</InputAdornment>,}}
                onChange={event => handleChange(Axis3D.Z, event)} defaultValue={DefaultPos.z}
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
                label="Yaw" id="outlined-start-adornment" sx={{ m: 1, width: '12ch' }}
                InputProps={{endAdornment: <InputAdornment position="end">deg</InputAdornment>,}}
                onChange={event => handleChange(Axis3D.X, event)} defaultValue={toDegrees(DefaultOrientation.x)}
            />
            <TextField
                label="Pitch" id="outlined-start-adornment" sx={{ m: 1, width: '12ch' }}
                InputProps={{endAdornment: <InputAdornment position="end">deg</InputAdornment>,}}
                onChange={event => handleChange(Axis3D.Y, event)} defaultValue={toDegrees(DefaultOrientation.y)}
            />
            <TextField
                label="Roll" id="outlined-start-adornment" sx={{ m: 1, width: '12ch' }}
                InputProps={{endAdornment: <InputAdornment position="end">deg</InputAdornment>,}}
                onChange={event => handleChange(Axis3D.Z, event)} defaultValue={toDegrees(DefaultOrientation.z)}
            />
        </Box>
    </div>)
}

const ArmAngleSpecification =  ({setArmAngle, armAngle} : {setArmAngle: (armAngle: number) => void, armAngle: number}) => {

    const handleChange = (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        setArmAngle(parseInt(event.target.value) / 180 * Math.PI);
    }

    return (<div>
        <Typography variant={"h5"}>Arm Angle</Typography>
        <Box sx={{display: 'flex', flexDirection: 'row'}}>
            <TextField
                label="Arm Angle" id="outlined-start-adornment" sx={{ m: 1, width: '12ch' }}
                InputProps={{endAdornment: <InputAdornment position="end">deg</InputAdornment>,}}
                onChange={handleChange} defaultValue={0}
            />
        </Box>
    </div>)
}

const SpecificationView = () => {

    const [ pos, setPos ] = useState(DefaultPos);
    const [ rot, setRot ] = useState(DefaultOrientation);
    const [ armAngle, setArmAngle ] = useState(0);

    const handleClick = () => {
        console.log(fromVector(pos));
        fetch('/api/arm-controller/absolute-specification', {
            method: "POST",
            body: JSON.stringify({
                armAngle: armAngle,
                endEffectorPosition: fromVector(pos),
                endEffectorRotation: { eulerAngles: fromVector(rot) }
            } as AbsoluteEndEffectorSpecificationAPIEntity) as any,
            headers: new Headers({'content-type': 'application/json'})
        }).then();
    }

    return (<Card sx={{margin: '5px', padding: '10px'}}>
        <PositionSpecification setPos={setPos} pos={pos} />
        <RotationSpecification setRot={setRot} rot={rot} />
        <ArmAngleSpecification setArmAngle={setArmAngle} armAngle={armAngle} />
        <Button variant={"contained"} onClick={handleClick}>Send</Button>
    </Card>)
}

export default SpecificationView;