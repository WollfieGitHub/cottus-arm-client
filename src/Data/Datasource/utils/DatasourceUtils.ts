
export interface TypedResponse<T = any> extends Response {
    json<P = T>(): Promise<P>;
}

export function typedFetch<T>(...args: any): Promise<TypedResponse<T>> {
    return fetch.apply(window, args);
}
