import {DatasourceObserver} from "../../../Data/Datasource/Observer/DatasourceObserver";

export interface ObservableRepository<T> {
    subscribe(subscriber: DatasourceObserver<T>): void;
    unsubscribe(subscriber: DatasourceObserver<T>): void;
}