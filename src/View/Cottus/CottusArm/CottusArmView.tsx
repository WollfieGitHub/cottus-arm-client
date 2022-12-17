import useCottusArmViewModel from "../../../Presentation/Cottus/CottusArm/CottusArmViewModel";
import {Box, Card} from "@mui/material";
import {TempSlider} from "./TempSlider";

const CottusArmView = () => {
    const { canvasWidth, canvasHeight, canvasRef } = useCottusArmViewModel();

    return (
        <Box>
            <Card sx={{ display: 'flex', padding: 2, width: "fit-content", margin: "0 auto 0 auto"}}>
                <div className={"cottus-arm-canvas"}>
                    <canvas width={canvasWidth} height={canvasHeight} ref={canvasRef} />
                </div>
            </Card>
            <TempSlider jointIndex={0}/>
            <TempSlider jointIndex={1}/>
            <TempSlider jointIndex={2}/>
            <TempSlider jointIndex={3}/>
            <TempSlider jointIndex={4}/>
            <TempSlider jointIndex={5}/>
        </Box>
    );
}

export default CottusArmView;