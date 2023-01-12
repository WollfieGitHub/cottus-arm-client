import {Box, Card, SxProps, Tab, Tabs, Theme, Typography} from "@mui/material";
import React, {MutableRefObject, useEffect, useState} from "react";
import AnimationPlayerView from "./AnimationPlayerView";
import AnimationRecorderView from "./AnimationRecorderView";
import {CottusArm} from "../../../Domain/Models/CottusArm";
import {AnimationPreview} from "../../../Domain/Models/Animation/AnimationPreview";
import {AnimationPrimitive} from "../../../Domain/Models/Animation/AnimationPrimitive";
import {useAnimationControlViewModel} from "../../../Presentation/Cottus/CottusArm/Animation/AnimationControlViewModel";

const AnimationControlView = ({sx, armRef, setAnimationPreview}: {
    sx?: SxProps<Theme>, 
    armRef: MutableRefObject<CottusArm|undefined>,
    setAnimationPreview: (preview?: AnimationPreview) => void
}) => {

    const [value, setValue] = React.useState(0);

    const {
        animations, getAnimationList,
        previewAnimation, hidePreview,
        saveAnimation, playAnimation
    } = useAnimationControlViewModel(setAnimationPreview);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    
    const setAnimationToPreview = (animation?: AnimationPrimitive) => {
        if (animation === undefined) { hidePreview(); } 
        else { previewAnimation(animation).then(); }
    }
    
    return (
        <Card sx={sx}>
            <Typography variant={'h4'} align={'center'} marginY={2}>
                Animation Control
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant={'fullWidth'}
                      textColor={'secondary'} indicatorColor={'primary'}>
                    <Tab label="Play" />
                    <Tab label="Record" />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <AnimationPlayerView setAnimationToPreview={setAnimationToPreview} animations={animations}
                    getAnimationList={getAnimationList} hidePreview={hidePreview} playAnimation={playAnimation} /> 
            </TabPanel> 
            <TabPanel value={value} index={1}> 
                <AnimationRecorderView arm={armRef} setAnimationToPreview={setAnimationToPreview}
                    saveAnimation={saveAnimation}/> 
            </TabPanel>
        </Card>
    );
}

interface TabPanelProps { children?: React.ReactNode; index: number; value: number; }

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 1 }}>{ children }</Box>
            )}
        </div>
    );
}

export default AnimationControlView;