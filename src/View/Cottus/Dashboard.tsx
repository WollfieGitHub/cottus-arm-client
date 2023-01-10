import {Box, Button, Stack, Typography} from "@mui/material";
import EndEffectorControlView from "./CottusArm/EndEffectorControlView";
import CottusArmView from "./CottusArm/CottusArmView";
import AnimationControlView from "./Animation/AnimationControlView";
import {MutableRefObject, useEffect, useRef, useState} from "react";
import CottusArmDatasourceAPIImpl from "../../Data/Datasource/API/CottusArmDatasourceAPIImpl";
import {jsx} from "@emotion/react";
import JSX = jsx.JSX;
import {CottusArm} from "../../Domain/Models/CottusArm";

const datasource: CottusArmDatasourceAPIImpl = new CottusArmDatasourceAPIImpl();

const Dashboard = () => {
    
    const [ armReady, setArmReady ] = useState<boolean>();
    const armRef = useRef<CottusArm>();
    const [ reconnectionDelay, setReconnectionDelay ] = useState(0);

    const [time, setTime] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 100);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const visibility: string = (armReady !== undefined && armReady) ? 'hidden' : 'visible';
    const reconnect = () => { datasource.resetReconnectionDelay(); }
    
    useEffect(() => { setReconnectionDelay(datasource.getCurrentDelay); }, [time])
    
    const content = (): JSX.Element|undefined => {
        
        if (datasource.connected) { 
            return (<Box sx={{
                display: 'flex', flexDirection: 'row',
                margin: "0 auto 0 auto",
                width: "max-content", height: 'max-content'
            }}>
                <AnimationControlView sx={{margin: '5px', padding: '10px', width: 380, visibility}} armRef={armRef}/>
                <CottusArmView setArmReady={setArmReady} visibility={visibility} datasource={datasource} armRef={armRef}/>
                <EndEffectorControlView sx={{margin: '5px', padding: '10px', width: 380, visibility}} />
            </Box>);
        } else {
            return (<Stack direction={'column'} className={'dashboard-content'} sx={{width: 400}} alignItems={'center'}>
                <Typography variant={'h6'} color={'white'}>
                    {`Reconnection in ${reconnectionDelay.toFixed(0)} seconds...`}
                </Typography>
                <Button onClick={reconnect} variant={'contained'} sx={{width: 200}}>
                    Try Reconnect Now
                </Button>
            </Stack>);
        }
    }
    
    return ( <>{ content() }</> );
}

export default Dashboard;