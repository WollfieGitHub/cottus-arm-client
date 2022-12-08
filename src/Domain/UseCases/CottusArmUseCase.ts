import {CottusArmRepository} from "../Repository/CottusArmRepository";
import {CottusArm} from "../Models/CottusArm";
import {RepositoryObserver} from "../Repository/Observer/RepositoryObserver";
import {ObservableUseCase} from "./Observer/ObservableUseCase";
import {UseCaseObserver} from "./Observer/UseCaseObserver";

export default class CottusArmUseCase implements RepositoryObserver<CottusArm>, ObservableUseCase<CottusArm> {
    id: string = "cottus-arm-use-case";
    private readonly subscribers: Set<UseCaseObserver<CottusArm>> = new Set();

    private readonly armRepository: CottusArmRepository;

    constructor(armRepository: CottusArmRepository) { 
        this.armRepository = armRepository;
    }

    onUpdate(data: CottusArm): void { this.subscribers.forEach(subscriber => subscriber(data)); }
    
    subscribe(subscriber: UseCaseObserver<CottusArm>) { this.subscribers.add(subscriber); }
}