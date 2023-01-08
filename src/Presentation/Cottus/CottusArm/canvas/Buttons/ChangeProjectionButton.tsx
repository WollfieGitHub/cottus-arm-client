import {Button} from "@mui/material";
import {ProjectionType} from "../../../../../Domain/Models/Maths/Projection/Projection";

const ChangeProjectionButton = ({ projectionType, setProjectionType }: {
    projectionType: ProjectionType
    setProjectionType: (p: ProjectionType) => void
}) => {

    const changeProjection = () => {
        switch (projectionType) {
            case ProjectionType.Orthographic: { setProjectionType(ProjectionType.Perspective); break; } 
            case ProjectionType.Perspective: { setProjectionType(ProjectionType.Orthographic); break; } 
        }
    };
    
    return (<Button variant={'contained'} onClick={changeProjection}>
        {`${projectionType} Projection`} 
    </Button>);
}

export default ChangeProjectionButton;