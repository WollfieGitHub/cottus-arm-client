import useCottusArmViewModel from "../../../Presentation/Cottus/CottusArm/CottusArmViewModel";
import {Box, Card} from "@mui/material";
import SpecificationView from "./SpecificationView";
import ChangeProjectionButton from "../../../Presentation/Cottus/CottusArm/canvas/Buttons/ChangeProjectionButton";
import ChangeEditModeButton from "../../../Presentation/Cottus/CottusArm/canvas/Buttons/ChangeEditModeButton";

const CottusArmView = () => {
    const { 
        canvasWidth, canvasHeight, canvasRef,
        projectionType, setProjectionType,
        editMode, setEditMode
    } = useCottusArmViewModel();

    return (
        <Box sx={{ 
            display: 'flex', flexDirection: 'row',
            margin: "0 auto 0 auto", 
            width: "max-content", height: 'max-content'
        }}>
            <Card sx={{ 
                display: 'flex', padding: 2, width: "fit-content", margin: "0 20 0 20",
                flexDirection: 'column'
            }}>
                <div className={"canvas"}>
                    <canvas width={canvasWidth} height={canvasHeight} ref={canvasRef} />
                </div>
                <div className={"canvas-buttons"} style={{
                    display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                    margin: '10px'
                }}>
                    <div className={'canvas-button'} style={{
                        display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                        width: '50%'
                    }}>
                        <ChangeProjectionButton {...{projectionType, setProjectionType}}/>
                    </div>
                    <div className={'canvas-button'} style={{
                        display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                        width: '50%'
                    }}>
                        <ChangeEditModeButton {...{editMode, setEditMode}} />
                    </div>
                </div>
            </Card>
            <SpecificationView />
        </Box>
    );
}

export default CottusArmView;