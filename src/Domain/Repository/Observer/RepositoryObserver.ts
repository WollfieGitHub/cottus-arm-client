
export interface RepositoryObserver<T> {
    onUpdate: (updated: T) => void,

    /** To debug mostly */
    id: string,
}