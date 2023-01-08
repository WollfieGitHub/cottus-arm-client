import {Card, SxProps, Theme, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useViewModel} from "../../../Presentation/Cottus/CottusArm/Animation/AnimationControlViewModel";
import {ArmAnimation} from "../../../Domain/Models/Animation/ArmAnimation";

const AnimationControlView = ({sx}: {sx?: SxProps<Theme>}) => {
    
    const { 
        animations, getAnimationList, 
        previewAnimation, currentPreview, hidePreview
    } = useViewModel();
    
    const [ selectedAnimation, setSelectedAnimation ] = useState<ArmAnimation>();
    
    useEffect(() => {
        getAnimationList().then();
    }, [])
    
    const getByName = (animationName: string): ArmAnimation|undefined => animations.find(_ => _.name === animationName);

    const handleChange = (event: React.MouseEvent<HTMLElement>, newAnimationName: string) => {
        setSelectedAnimation(getByName(newAnimationName));
    };
    
    const handleHoverBegin = (animation: ArmAnimation) => { previewAnimation(animation).then(); }
    const handleHoverEnd = () => { hidePreview(); }
    
    return (
        <Card sx={sx}>
            <Typography variant={'h4'} align={'center'} marginY={2}>
                Animation Control
            </Typography>
            <ToggleButtonGroup 
                color={'primary'} 
                value={selectedAnimation?.name}
                exclusive onChange={handleChange}
                orientation={'vertical'}
            >
                { animations.map(animation => AnimationView(animation, handleHoverBegin, handleHoverEnd)) }
            </ToggleButtonGroup>
        </Card>
    );
}

const AnimationView = (
    animation: ArmAnimation, 
    onHoverBegin: (animation: ArmAnimation) => void,
    onHoverEnd: () => void
): JSX.Element => {
    
    return (
        <ToggleButton 
            value={animation.name} 
            onMouseEnter={e => onHoverBegin(animation)}
            onMouseLeave={e => onHoverEnd()}
        >
            {animation.name}
        </ToggleButton>
    );
}

export default AnimationControlView;