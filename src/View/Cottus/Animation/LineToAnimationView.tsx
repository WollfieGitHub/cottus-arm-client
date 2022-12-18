import {useViewModel} from "../../../Presentation/Cottus/CottusArm/Animation/LineToAnimationViewModel";
import {Accordion, AccordionDetails, AccordionSummary, Card, Typography} from "@mui/material";
import {ExpandMore} from "@mui/icons-material"

export const LineToAnimationView = () => {
    
    const { setPosition, setRelative, setTime, animation } = useViewModel();
    
    
    return (<div className={"line-to-animation"}>
        { /* Doesn't work */ }
        <Accordion aria-orientation={"horizontal"}>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>Accordion 1</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                </Typography>
            </AccordionDetails>
        </Accordion>
    </div>)
}