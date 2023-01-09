import { Box } from "@mui/material";
import EndEffectorControlView from "./CottusArm/EndEffectorControlView";
import CottusArmView from "./CottusArm/CottusArmView";
import AnimationPlayerView from "./Animation/AnimationPlayerView";
import AnimationControlView from "./Animation/AnimationControlView";

const Dashboard = () => {
    
    return (
        <Box sx={{
            display: 'flex', flexDirection: 'row',
            margin: "0 auto 0 auto",
            width: "max-content", height: 'max-content'
        }}>
            <AnimationControlView sx={{margin: '5px', padding: '10px', width: 380}} />
            <CottusArmView />
            <EndEffectorControlView sx={{margin: '5px', padding: '10px', width: 380}} />
        </Box>
    );
}

export default Dashboard;