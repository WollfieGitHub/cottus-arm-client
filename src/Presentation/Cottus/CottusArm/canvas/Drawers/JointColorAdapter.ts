import {Joint} from "../../../../../Domain/Models/Joint";
import Color from "../../../../Utils/Color";

export default function getColorOf(joint: Joint, nbJoints: number): Color {
    let articulationIndex: number = 0;
    while (joint.parent !== null) {
        joint = joint.parent;
        articulationIndex++;
    }
    return Color.fromHsl(articulationIndex/nbJoints * 360, 50, 75);
}