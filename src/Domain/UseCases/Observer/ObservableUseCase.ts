import {UseCaseObserver} from "./UseCaseObserver";

export interface ObservableUseCase<T> {
    subscribe(subscriber: UseCaseObserver<T>): void;
}