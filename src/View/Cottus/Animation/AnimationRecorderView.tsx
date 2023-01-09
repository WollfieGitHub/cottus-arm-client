import {Box, Button, Divider, Stack, Tab, Tabs, TextField, Tooltip, Typography} from "@mui/material";
import {Circle, Undo} from "@mui/icons-material";
import React, {useState} from "react";
import PrebuiltAnimationSelectorView from "./PrebuiltAnimationSelectorView";
import AnimationTimelineView from "./AnimationTimelineView";
import AnimationPlayerView from "./AnimationPlayerView";

const centeredRowFlexbox: any = {display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"};
const centeredColumnFlexbox: any = {display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly"};

const AnimationRecorderView = () => {
    
    const [ recording, setRecording ] = useState(false);
    const [ name, setName ] = useState('');

    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };
    
    return (
        <div className={'animation-recorder'} style={{}}>
            <div style={{width: '80%', margin: '0 auto 0 auto'}}>
                <Stack direction={'column'} spacing={0.5}
                       sx={{margin: 1}} justifyContent={'space-evenly'}
                >
                    
                        <TextField onChange={e => setName(e.target.value)}
                                   id="outlined-basic" label="Animation Name" variant="outlined"
                                   fullWidth={true} sx={{margin: '10px 0 10px 0'}}
                                   disabled={recording}
                        />
                        <Button variant={'contained'} color={(!recording ? 'primary' : 'error')}
                                onClick={() => setRecording(!recording)}
                                sx={{margin: '0 0 10px 0'}} disabled={name === ''}
                        >
                            {!recording ? 'Create New' : 'Cancel Creation'}
                        </Button>
                    
                </Stack>
            </div>
            <Divider variant={'middle'}/>
            <Stack direction={'row'} spacing={1} justifyContent={'center'} alignItems={'center'}>
                <UndoButton recording={recording}/>
                <CaptureCurrentFrameButton recording={recording}/>
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
                    <div className={'prebuilt-animation'} style={{...centeredColumnFlexbox}}>
                        <PrebuiltAnimationSelectorView recording={recording}/>
                    </div>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <div className={'animation-timeline'} style={{...centeredColumnFlexbox}}>
                        <AnimationTimelineView />
                    </div>
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

const UndoButton = (props: { recording: boolean }) => {
    return (
        <Tooltip title={
            <React.Fragment>
                <Typography color="inherit">Undo the last action</Typography>
                {"Undo either the last frame capture or last animation added"}
            </React.Fragment>
        }>
            <Button disabled={!props.recording} variant={"outlined"} startIcon={<Undo color={"secondary"}/>}>
                Undo
            </Button>
        </Tooltip>);
}



const CaptureCurrentFrameButton = (props: { recording: boolean }) => {
    return <div className={"capture-frame-btn"}
                style={{...centeredRowFlexbox, padding: '10px 0 10px 0'}}>
        <Tooltip title={
            <React.Fragment>
                <Typography color="inherit">Capture the Current Frame</Typography>
                {"Fill the current animation's position field with the current position" +
                    " of the end effector"}
            </React.Fragment>
        }>
            <Button variant={"outlined"} startIcon={<Circle color={"error"}/>}
                    disabled={!props.recording}>
                Capture Frame
            </Button>
        </Tooltip>
    </div>;
}

export default AnimationRecorderView;