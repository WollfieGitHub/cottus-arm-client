import {useEffect, useState} from "react";
import useCottusArmViewModel from "./CottusArmViewModel";
import {Box, Card, CardMedia, Slider} from "@mui/material";
import CottusArmCanvas from "./canvas/CottusArmCanvas";

const CottusArmView = () => {
    const { cottusArm } = useCottusArmViewModel();

    return (<Card sx={{ display: 'flex' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <CottusArmCanvas cottusArm={cottusArm} />
        </Box>
    </Card>)
}

export default CottusArmView;