import {useEffect, useState} from "react";
import useCottusArmViewModel from "./CottusArmViewModel";
import {Box, Card, CardMedia, Slider} from "@mui/material";
import CottusArmCanvas from "./canvas/CottusArmCanvas";

const CottusArmView = () => {
    const { cottusArm } = useCottusArmViewModel();

    return (
        <Card sx={{ display: 'flex', padding: 2, width: "fit-content", margin: "0 auto 0 auto"}}>
            <CottusArmCanvas cottusArm={cottusArm} />
        </Card>
    );
}

export default CottusArmView;