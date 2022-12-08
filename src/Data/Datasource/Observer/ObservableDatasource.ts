/** A datasource that sends update instead of handling requests for a new state */
import {DatasourceObserver} from "./DatasourceObserver";

export interface ObservableDatasource<T> {
    subscribe(subscriber: DatasourceObserver<T>): void;
    unsubscribe(subscriber: DatasourceObserver<T>): void;
}