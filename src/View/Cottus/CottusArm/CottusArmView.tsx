import useCottusArmViewModel from "../../../Presentation/Cottus/CottusArm/CottusArmViewModel";
import {Box, Card, useTheme} from "@mui/material";
import EndEffectorControlView from "./EndEffectorControlView";
import ChangeProjectionButton from "../../../Presentation/Cottus/CottusArm/canvas/Buttons/ChangeProjectionButton";
import ChangeEditModeButton from "../../../Presentation/Cottus/CottusArm/canvas/Buttons/ChangeEditModeButton";
import {MutableRefObject, useEffect} from "react";
import CottusArmDatasource from "../../../Data/Datasource/CottusArmDatasource";
import {CottusArm} from "../../../Domain/Models/CottusArm";
import {AnimationPreview} from "../../../Domain/Models/Animation/AnimationPreview";

const CottusArmView = (props: {
    setArmReady: (ready: boolean|undefined) => void, 
    visibility: string,
    datasource: CottusArmDatasource,
    armRef: MutableRefObject<CottusArm|undefined>,
    animationPreview?: AnimationPreview
}) => {
    const { 
        canvasWidth, canvasHeight, canvasRef,
        projectionType, setProjectionType,
        editMode, setEditMode
    } = useCottusArmViewModel(props.datasource, props.armRef, props.animationPreview);
    
    const theme = useTheme();
    
    useEffect(() => {
        props.setArmReady(props.armRef.current === undefined ? undefined : props.armRef.current.ready);
    }, [props, props.armRef.current])

    return (
        <Card sx={{
            display: 'flex', padding: 2, width: "fit-content", margin: "0 20 0 20",
            flexDirection: 'column', visibility: props.visibility
        }}>
            <div className={"canvas"} >
                <canvas width={canvasWidth} height={canvasHeight} ref={canvasRef}
                        style={{borderColor: theme.palette.secondary.main, borderWidth: '0.25px', borderStyle: 'solid'}}
                />
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
    );
}

export default CottusArmView;