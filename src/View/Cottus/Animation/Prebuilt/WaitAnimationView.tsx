import {Divider, InputAdornment, Stack, Switch, TextField, Typography} from "@mui/material";
import {PositionSpecificationView} from "../../CottusArm/PositionSpecificationView";
import React from "react";

const WaitAnimationView = () => {
    
    return (
        <div className={"line-to-animation"} style={{width: '100%'}}>
            { /* Doesn't work */ }
            <div className={'duration'} style={{marginBottom: 10}}>
                <TextField label={'Duration'}
                           InputProps={{endAdornment: <InputAdornment position="end">sec</InputAdornment>,}}
                />
            </div>
        </div>
    );
}

export default WaitAnimationView;