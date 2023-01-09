import {Card, SxProps, Theme, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useViewModel} from "../../../Presentation/Cottus/CottusArm/Animation/AnimationControlViewModel";
import {AnimationEntry} from "../../../Domain/Models/Animation/AnimationEntry";

const AnimationPlayerView = () => {
    
    const { 
        animations, getAnimationList, 
        previewAnimation, currentPreview, hidePreview
    } = useViewModel();
    
    const [ selectedAnimation, setSelectedAnimation ] = useState<AnimationEntry>();
    
    useEffect(() => {
        getAnimationList().then();
    }, [])
    
    const getByName = (animationName: string): AnimationEntry|undefined => animations.find(_ => _.name === animationName);

    const handleChange = (event: React.MouseEvent<HTMLElement>, newAnimationName: string) => {
        setSelectedAnimation(getByName(newAnimationName));
    };
    
    const handleHoverBegin = (animation: AnimationEntry) => { previewAnimation(animation.animation).then(); }
    const handleHoverEnd = () => { hidePreview(); }
    
    return (
        <div className={'animation-player'}>
            <ToggleButtonGroup
                color={'primary'}
                value={selectedAnimation?.name}
                exclusive onChange={handleChange}
                orientation={'vertical'}
            >
                { animations.map(animation => AnimationView(animation, handleHoverBegin, handleHoverEnd)) }
            </ToggleButtonGroup>
        </div>
    );
}

const AnimationView = (
    animation: AnimationEntry, 
    onHoverBegin: (animation: AnimationEntry) => void,
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

export default AnimationPlayerView;