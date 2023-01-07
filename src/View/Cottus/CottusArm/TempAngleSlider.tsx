import {Slider} from "@mui/material";

export const TempAngleSlider = ({
    jointIndex
}: {jointIndex: number}) => {

    const handleSliderChange = (event: Event, val: number | number[], activeThumb: number) => {
        if (Array.isArray(val)) { return; }

        console.log(val / Math.PI * 180)
        
        fetch(`/api/arm-controller/angle?joint=${jointIndex}`, {
            method: "POST",
            body: val as any
        }).then();
    }
    
    return (<Slider 
        step={0.1}
        track={false}
        min={-Math.PI}
        max={Math.PI}
        defaultValue={0}
        onChange={handleSliderChange}
    ></Slider>);
}