import useCottusArmViewModel from "../../../Presentation/Cottus/CottusArm/CottusArmViewModel";
import {Box, Card} from "@mui/material";
import SpecificationView from "./SpecificationView";

const CottusArmView = () => {
    const { canvasWidth, canvasHeight, canvasRef } = useCottusArmViewModel();

    return (
        <Box sx={{ 
            display: 'flex', flexDirection: 'row',
            margin: "0 auto 0 auto", 
            width: "max-content", height: 'max-content'
        }}>
            <Card sx={{ display: 'flex', padding: 2, width: "fit-content", margin: "0 20 0 20"}}>
                <div className={"cottus-arm-canvas"}>
                    <canvas width={canvasWidth} height={canvasHeight} ref={canvasRef} />
                </div>
            </Card>
            <SpecificationView />
        </Box>
    );
}

export default CottusArmView;