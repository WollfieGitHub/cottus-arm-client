import {
    Divider,
    FormControl,
    InputLabel,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent
} from "@mui/material";
import {useEffect, useState} from "react";
import {LineToAnimationView} from "./Prebuilt/LineToAnimationView";
import {ContentCut} from "@mui/icons-material";
import {BezierToAnimationView} from "./Prebuilt/BezierToAnimationView";
import WaitAnimationView from "./Prebuilt/WaitAnimationView";

const PrebuiltAnimationSelectorView = (props: {recording: boolean}) => {

    const [prebuiltAnimationIndex, setPrebuiltAnimationIndex] = useState<number|undefined>(undefined);

    const handleChange = (event: SelectChangeEvent) => {
        const val: string = event.target.value;
        if (val === '') { setPrebuiltAnimationIndex(undefined); }
        else {
            setPrebuiltAnimationIndex(parseInt(val));
        }
    };
    
    const getPrebuiltAnimationBuilder = (): JSX.Element|undefined => {
        switch (prebuiltAnimationIndex) {
            case 0: { return (<LineToAnimationView />); }
            case 1: { return (<BezierToAnimationView />); }
            case 2: { return (<BezierToAnimationView />); }
            case 3: { return (<WaitAnimationView />); }
        }
        return undefined;
    }
    
    useEffect(() => {
        if (!props.recording) { setPrebuiltAnimationIndex(undefined); }
    }, [props.recording])

    return (
        <Paper elevation={6} sx={{ width: '100%', padding: '10px', margin: '10px 0 10px 0',
            maxHeight: '300px', overflowY: 'auto'}}
        >
            <div className={'prebuilt-selection'} style={{margin: '10px auto 10px auto', width: '90%'}}>
                <FormControl fullWidth disabled={!props.recording}>
                    <InputLabel id="demo-simple-select-label">Prebuilt Animation</InputLabel>
                    <Select
                        variant={'standard'}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={`${prebuiltAnimationIndex}`}
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
    );
}

export default PrebuiltAnimationSelectorView;