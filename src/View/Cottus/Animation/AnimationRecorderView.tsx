import {Box, Button, Divider, Stack, Tab, Tabs, TextField, Tooltip, Typography} from "@mui/material";
import {Circle, Undo} from "@mui/icons-material";
import React, {MutableRefObject, useState} from "react";
import PrebuiltAnimationSelectorView from "./PrebuiltAnimationSelectorView";
import AnimationTimelineView from "./AnimationTimelineView";
import AnimationPlayerView from "./AnimationPlayerView";
import useViewModel from "../../../Presentation/Cottus/CottusArm/Animation/AnimationRecorderViewModel";
import {CottusArm} from "../../../Domain/Models/CottusArm";
import {AnimationPreview} from "../../../Domain/Models/Animation/AnimationPreview";
import {AnimationPrimitive} from "../../../Domain/Models/Animation/AnimationPrimitive";

const centeredRowFlexbox: any = {display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"};
const centeredColumnFlexbox: any = {display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly"};

const AnimationRecorderView = (props: {
    arm: MutableRefObject<CottusArm|undefined>,
    setAnimationToPreview: (preview?: AnimationPrimitive) => void,
    saveAnimation: (name: string, animation: AnimationPrimitive) => Promise<boolean>,
}) => {
    
    const { 
        recording, setRecording,
        name, setName,
        undoLast, remove, captureFrame,
        currentFramePosition, addAnimation,
        setPreview, animation
    } = useViewModel(props.arm, props.setAnimationToPreview);

    const [tabValue, setTabValue] = useState(0);

    const [ saveFailed, setSaveFailed ] = useState(false);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => { setTabValue(newValue); };
    
    const notifySaveFailed = () => {
        setSaveFailed(true);
        setTimeout(() => setSaveFailed(false), 1000);
    }
    
    return (
        <div className={'animation-recorder'} style={{}}>
            <div style={{width: '80%', margin: '0 auto 0 auto'}}>
                <Stack direction={'column'} spacing={0.5}
                       sx={{margin: 1}} justifyContent={'space-evenly'}>
                    <TextField onChange={e => setName(e.target.value)}
                               id="outlined-basic" label="Animation Name" variant="outlined"
                               fullWidth={true} sx={{margin: '10px 0 10px 0'}}
                               disabled={recording}/>
                    <Stack direction={'row'} justifyContent={'space-evenly'}>
                        <Button variant={'contained'} color={(!recording ? 'primary' : 'error')} 
                                onClick={() => setRecording(!recording)} disabled={name === ''}>
                            {!recording ? 'Create New' : 'Cancel Creation'}
                        </Button>
                        <Button variant={'contained'} color={(saveFailed ? 'error' : 'success')} 
                                onClick={() => {
                                    if (animation.animations.length === 0) { notifySaveFailed() }
                                    else {
                                        props.saveAnimation(name, animation).then(success => {
                                            if (!success) { notifySaveFailed(); }
                                            else { setRecording(false) }
                                        });
                                    }
                                }} disabled={!recording}>
                            {"Save"}
                        </Button>
                    </Stack>
                </Stack>
            </div>
            <Divider variant={'middle'}/>
            <Stack direction={'row'} spacing={1} justifyContent={'center'} alignItems={'center'}>
                <UndoButton recording={recording} undo={undoLast}/>
                <CaptureCurrentFrameButton recording={recording} capture={captureFrame} />
            </Stack>
            <div className={'animation-creation-tabs'}>
                <Stack sx={{ borderBottom: 1, borderColor: 'divider', width: '90%'}} >
                    <Tabs value={tabValue} onChange={handleTabChange}
                          aria-label="basic tabs example"
                          variant={'fullWidth'}
                          textColor={'secondary'}
                          indicatorColor={'primary'}
                    >
                        <Tab label="Chain Animation" />
                        <Tab label="Timeline" />
                    </Tabs>
                </Stack>
                <TabPanel value={tabValue} index={0}>
                    <Stack className={'prebuilt-animation'} direction={'column'} justifyContent={'center'}>
                        <PrebuiltAnimationSelectorView recording={recording} position={currentFramePosition}
                            setAnimation={setPreview} addAnimation={addAnimation}/>
                    </Stack>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <Stack className={'animation-timeline'} direction={'column'} justifyContent={'center'}>
                        <AnimationTimelineView composedAnimation={animation} />
                    </Stack>
                </TabPanel>
            </div>
        </div>
    );
}


interface TabPanelProps { children?: React.ReactNode; index: number; value: number; }

const TabPanel = (props: TabPanelProps) => {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (<Box sx={{p: 2}}> {children} </Box>)}
        </div>
    );
}

const UndoButton = (props: {
    recording: boolean,
    undo: () => void
}) => {
    return (
        <Tooltip title={
            <React.Fragment>
                <Typography color="inherit">Undo the last action</Typography>
                {"Undo either the last frame capture or last animation added"}
            </React.Fragment>
        }>
            <span>
                <Button disabled={!props.recording} variant={"outlined"} 
                        startIcon={<Undo color={"secondary"}/>} onClick={props.undo}
                >
                    Undo
                </Button>
            </span>
        </Tooltip>);
}



const CaptureCurrentFrameButton = (props: { 
    recording: boolean,
    capture: () => void
}) => {
    return (<div className={"capture-frame-btn"}
                style={{...centeredRowFlexbox, padding: '10px 0 10px 0'}}>
        <Tooltip title={
            <React.Fragment>
                <Typography color="inherit">Capture the Current Frame</Typography>
                {"Fill the current animation's position field with the current position" +
                    " of the end effector"}
            </React.Fragment>
        }>
            <span>
                <Button variant={"outlined"} startIcon={<Circle color={"error"}/>}
                        disabled={!props.recording} onClick={props.capture}>
                    Capture Frame
                </Button>
            </span>
        </Tooltip>
    </div>);
}

export default AnimationRecorderView;