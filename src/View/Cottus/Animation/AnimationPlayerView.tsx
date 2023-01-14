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
    playAnimation: (name: string) => Promise<boolean>
    disabled: boolean
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
            <ToggleButtonGroup fullWidth
                color={'primary'} value={selectedAnimation?.name}
                exclusive onChange={handleChange}
                orientation={'vertical'}
            >
                { animations.map((animation, i) => AnimationView(
                    animation, handleHoverBegin, handleHoverEnd, props.playAnimation, i, props.disabled
                )) }
            </ToggleButtonGroup>
        </div>
    );
}

const AnimationView = (
    animation: AnimationEntry, 
    onHoverBegin: (animation: AnimationEntry) => void,
    onHoverEnd: () => void,
    playAnimation: (name: string) => Promise<boolean>,
    key: number,
    disabled: boolean
): JSX.Element => {
    
    return (
        <ToggleButton 
            key={key}
            value={animation.name} 
            onMouseEnter={e => onHoverBegin(animation)}
            fullWidth disabled={disabled}
            onClick={() => playAnimation(animation.name)}
            sx={{justifyContent: 'left'}}
        >
            {animation.name}
        </ToggleButton>
    );
}

export default AnimationPlayerView;