import {Card, SxProps, Theme, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useAnimationControlViewModel} from "../../../Presentation/Cottus/CottusArm/Animation/AnimationControlViewModel";
import {AnimationEntry} from "../../../Domain/Models/Animation/AnimationEntry";
import {AnimationPreview} from "../../../Domain/Models/Animation/AnimationPreview";
import {AnimationPrimitive} from "../../../Domain/Models/Animation/AnimationPrimitive";

const AnimationPlayerView = (props: {
    setAnimationToPreview: (preview?: AnimationPrimitive) => void,
    getAnimationList: () => Promise<void>,
    animations: AnimationEntry[],
    hidePreview: () => void,
}) => {

    const {
        animations, getAnimationList,
        setAnimationToPreview, hidePreview
    } = props;
    
    const [ selectedAnimation, setSelectedAnimation ] = useState<AnimationEntry>();
    
    useEffect(() => {
        getAnimationList().then();
    }, [])
    
    const getByName = (animationName: string): AnimationEntry|undefined => animations.find(_ => _.name === animationName);

    const handleChange = (event: React.MouseEvent<HTMLElement>, newAnimationName: string) => {
        setSelectedAnimation(getByName(newAnimationName));
    };
    
    const handleHoverBegin = (animation: AnimationEntry) => { setAnimationToPreview(animation.animation); }
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