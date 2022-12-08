import {useState} from "react";
import {CottusArm} from "../../../Domain/Models/CottusArm";
import {CottusArmRepositoryImpl} from "../../../Data/Repository/CottusArmRepositoryImpl";
import CottusArmDatasourceAPIImpl from "../../../Data/Datasource/API/CottusArmDatasourceAPIImpl";
import CottusArmUseCase from "../../../Domain/UseCases/CottusArmUseCase";

export default function useCottusArmViewModel() {
    const [ cottusArm, setCottusArm ] = useState<CottusArm>();
    
    const UseCase = new CottusArmUseCase( new CottusArmRepositoryImpl(new CottusArmDatasourceAPIImpl()) );
    
    UseCase.subscribe((data) => { setCottusArm(data); })
    
    return { cottusArm };
}