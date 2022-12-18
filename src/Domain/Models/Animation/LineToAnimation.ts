import {Vector3D} from "../Maths/Vector3D";
import {EndEffectorAnimation} from "./EndEffectorAnimation";

export interface LineToAnimation extends EndEffectorAnimation{
    position: Vector3D,
}