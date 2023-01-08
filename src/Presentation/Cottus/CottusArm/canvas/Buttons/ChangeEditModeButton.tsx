import {Button} from "@mui/material";
import { EditMode } from "../../../../Tools/EditMode";

const ChangeEditModeButton = ({ editMode, setEditMode }: {
    editMode: EditMode
    setEditMode: (p: EditMode) => void
}) => {

    const changeEditMode = () => {
        switch (editMode) {
            case EditMode.EndEffectorMode: { setEditMode(EditMode.JointMode); break; }
            case EditMode.JointMode: { setEditMode(EditMode.EndEffectorMode); break; }
        }
    };

    return (<Button variant={'contained'} onClick={changeEditMode}>
        { editMode }
    </Button>);
}

export default ChangeEditModeButton;