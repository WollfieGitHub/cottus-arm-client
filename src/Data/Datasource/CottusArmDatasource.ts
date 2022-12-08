import {CottusArm} from "../../Domain/Models/CottusArm";
import {ObservableDatasource} from "./Observer/ObservableDatasource";

export default interface CottusArmDatasource
    extends ObservableDatasource<CottusArm> { }