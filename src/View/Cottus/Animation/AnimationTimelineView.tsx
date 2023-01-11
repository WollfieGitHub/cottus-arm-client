import {IconButton, Paper, Stack, Step, StepLabel, Stepper} from "@mui/material";
import {Circle, DeleteOutlined, Timeline} from "@mui/icons-material";
import {useState} from "react";
import {AnimationComposition} from "../../../Domain/Models/Animation/Prebuilt/AnimationComposition";

const AnimationTimelineView = (props: {
    composedAnimation: AnimationComposition   
}) => {
    
    const [ hoveredStep, setHoveredStep ] = useState(0);
    
    const getTimeline = () => {
        let sum: number = 0;
        let result = [];
        for (const animation of props.composedAnimation.animations) {
            sum += animation.timeSec;
            result.push({label: animation.getName(), icon: animation.getIcon(), timestamp: sum});
        }
        return result;
    }
    
    return (
        <Paper elevation={0} sx={{ width: '100%', padding: '10px', margin: '10px 0 10px 0',
            overflowY: 'auto', maxHeight: '300px'}}>
            <Stepper orientation={'vertical'} activeStep={hoveredStep}>
                { getTimeline().map((step, i) => { return (
                    <Step key={step.label} onMouseEnter={e => setHoveredStep(i)}
                    >
                        <Stack direction={'row'} alignItems={'flex-start'} style={{cursor: (i === hoveredStep ? 'pointer' : undefined)}}>
                            <StepLabel icon={step.icon}>{step.label + ' @ ' + step.timestamp.toFixed(1) + ' sec'}</StepLabel>
                            { i === hoveredStep ? (
                                <IconButton color={'primary'}>
                                    <DeleteOutlined />
                                </IconButton>
                            ) :  undefined }
                        </Stack>
                    </Step>
                ); } ) }
            </Stepper>
        </Paper>
    );
}

export default AnimationTimelineView;