import {
    Button,
    Divider,
    FormControl,
    InputLabel,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent, Stack
} from "@mui/material";
import {useEffect, useState} from "react";
import {LineToAnimationView} from "./Prebuilt/LineToAnimationView";
import {ContentCut} from "@mui/icons-material";
import {BezierToAnimationView} from "./Prebuilt/BezierToAnimationView";
import WaitAnimationView from "./Prebuilt/WaitAnimationView";
import {Vector3D} from "../../../Domain/Models/Maths/Vector3D";
import {AnimationPrimitive} from "../../../Domain/Models/Animation/AnimationPrimitive";
import SemicircleToAnimationView from "./Prebuilt/SemicircleToAnimationView";

const PrebuiltAnimationSelectorView = (props: {
    recording: boolean,
    position: Vector3D|undefined // Position to fill the animation with
    setAnimation: (animation: AnimationPrimitive) => void,
    addAnimation: () => void
}) => {

    const [prebuiltAnimationIndex, setPrebuiltAnimationIndex] = useState<number|undefined>(undefined);

    const handleChange = (event: SelectChangeEvent) => {
        const val: string = event.target.value;
        if (val === '') { setPrebuiltAnimationIndex(undefined); }
        else {
            setPrebuiltAnimationIndex(parseInt(val));
        }
    };
    
    const getPrebuiltAnimationBuilder = (): JSX.Element|undefined => {
        if (prebuiltAnimationIndex === undefined) { return undefined; }
        
        switch (prebuiltAnimationIndex) {
            case 0: { return (<LineToAnimationView position={props.position} setAnimation={props.setAnimation}/>); }
            case 1: { return (<BezierToAnimationView />); }
            case 2: { return (<SemicircleToAnimationView position={props.position} setAnimation={props.setAnimation}/>); }
            case 3: { return (<WaitAnimationView />); }
        }
        return undefined;
    }
    
    useEffect(() => {
        if (!props.recording) { setPrebuiltAnimationIndex(undefined); }
    }, [props.recording])

    return (
        <Stack direction={'column'} alignItems={'center'} sx={{ width: '100%', padding: 1, margin: 0}}>
            <Paper elevation={6} sx={{width:'100%', maxHeight: '300px', overflowY: 'auto',
                display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 2}}>
                <div className={'prebuilt-selection'} style={{margin: 0, width: '90%'}}>
                    <FormControl fullWidth disabled={!props.recording}>
                        <InputLabel id="demo-simple-select-label">Prebuilt Animation</InputLabel>
                        <Select
                            variant={'standard'}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={`${prebuiltAnimationIndex === undefined ? '' : prebuiltAnimationIndex}`}
                            label="Prebuilt Animation"
                            onChange={handleChange}
                        >
                            <MenuItem value={0}>Line To</MenuItem>
                            <MenuItem value={1}>Bézier To</MenuItem>
                            <MenuItem value={2}>Semicircle To</MenuItem>
                            <MenuItem value={3}>Wait</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                { prebuiltAnimationIndex === undefined ? undefined : <Divider /> }
                <div className={'prebuilt-animation-builder'} style={{margin: '10px auto 0 auto', width: '90%'}}>
                    { getPrebuiltAnimationBuilder() }
                </div>

            </Paper>
            <div className={'chain-animation-button'} style={{margin: 10}}>
                <Button onClick={() => {
                    setPrebuiltAnimationIndex(undefined)
                    props.addAnimation();
                }} variant={'contained'} disabled={!props.recording}>
                    Add Animation
                </Button>
            </div>
        </Stack>
        
    );
}

export default PrebuiltAnimationSelectorView;