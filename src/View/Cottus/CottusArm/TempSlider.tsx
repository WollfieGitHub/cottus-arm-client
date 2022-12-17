import {Slider} from "@mui/material";

export const TempSlider = ({
    jointIndex
}: {jointIndex: number}) => {

    const handleSliderChange = (event: Event, val: number | number[], activeThumb: number) => {
        if (Array.isArray(val)) { return; }

        fetch(`/api/arm-controller/angle?n=${jointIndex}`, {
            method: "POST",
            body: val as any
        }).then();
    }
    
    return (<Slider 
        step={0.1}
        min={0}
        max={Math.PI*2}
        onChange={handleSliderChange}
    ></Slider>);
}