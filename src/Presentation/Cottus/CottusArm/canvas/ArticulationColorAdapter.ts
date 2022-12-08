import {Articulation} from "../../../../Domain/Models/Articulation";
import Color from "../../../utils/Color";
import {CottusArmInfo} from "../../../../Domain/Models/CottusArm";

export default function getColorOf(articulation: Articulation): Color {
    let articulationIndex: number = 0;
    while (articulation.parent !== null) {
        articulation = articulation.parent;
        articulationIndex++;
    }
    return Color.fromHsl(articulationIndex/CottusArmInfo.NumberOfArticulations * 360, 100, 50);
}