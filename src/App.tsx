import React from 'react';
import "./App.scss";
import CottusArmView from "./View/Cottus/CottusArm/CottusArmView";
import {createTheme, ThemeProvider, Typography} from "@mui/material";
import {LineToAnimationView} from "./View/Cottus/Animation/LineToAnimationView";

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#00bfa5', },
        secondary: { main: '#ff9e80', },
    },
})

function App() {
  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <ThemeProvider theme={theme}>
            <div>
                <Typography sx={{ margin: "50 auto 50 auto" }}
                    variant={"h2"}
                    fontFamily={"comic-sans"}
                    color={"white"}
                >
                    Cottus Arm Controller
                </Typography>
            </div>
            <CottusArmView />   
        </ThemeProvider>
    </div>
  );
}

export default App;
