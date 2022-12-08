
export interface DatasourceObserver<T> {
    onUpdate: (updated: T) => void,
    
    /** To debug mostly */
    id: string, 
}