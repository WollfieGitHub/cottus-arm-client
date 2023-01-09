import {Paper, Step, StepLabel, Stepper} from "@mui/material";
import {Circle, Timeline} from "@mui/icons-material";
import {useState} from "react";

const steps = [
    { label: 'Line To', icon: <Timeline />, timestamp: 0.14 },
    { label: 'Line To', icon: <Timeline />, timestamp: 0.24},
    { label: 'Frame Capture', icon: <Circle />, timestamp: 0.6 },
    { label: 'Frame Capture', icon: <Circle />, timestamp: 0.6 },
    { label: 'Frame Capture', icon: <Circle />, timestamp: 0.6 },
    { label: 'Frame Capture', icon: <Circle />, timestamp: 0.6 },
    { label: 'Frame Capture', icon: <Circle />, timestamp: 0.6 },
    { label: 'Frame Capture', icon: <Circle />, timestamp: 0.6 },
]

const AnimationTimelineView = () => {
    
    const [ hoveredStep, setHoveredStep ] = useState(0);
    
    
    return (
        <Paper elevation={0} sx={{ width: '100%', padding: '10px', margin: '10px 0 10px 0',
            overflowY: 'auto', maxHeight: '300px'}}>
            <Stepper orientation={'vertical'} activeStep={hoveredStep}>
                { steps.map((step, i) => (
                    <Step key={step.label} onMouseEnter={e => setHoveredStep(i)}>
                        <StepLabel icon={step.icon}>{step.label + ' @ ' + step.timestamp + ' sec'}</StepLabel>
                    </Step>
                )) }
            </Stepper>
        </Paper>
    );
}

export default AnimationTimelineView;