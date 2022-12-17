import React from 'react';
import "./App.scss";
import CottusArmView from "./View/Cottus/CottusArm/CottusArmView";
import {createTheme, ThemeProvider, Typography} from "@mui/material";

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#00bfa5', },
        secondary: { main: '#ff9e80', },
    },
})

function App() {
  return (
    <div className="App">
        <ThemeProvider theme={theme}>
            <div style={{margin: "0 auto 0 auto", width: 'fit-content'}}>
                <Typography
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
