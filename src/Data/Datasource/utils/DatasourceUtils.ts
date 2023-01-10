export interface TypedResponse<T = any> extends Response {
    json<P = T>(): Promise<P>;
}

export function typedFetch<T>(url: RequestInfo, init?: RequestInit): Promise<TypedResponse<T>> {
    return fetch(url, init);
}

export function typedPost<T, R>(url: RequestInfo, obj: T): Promise<TypedResponse<R>> {
    return fetch(url, {
        method: "POST",
        body: JSON.stringify(obj) as any,
        headers: new Headers({'content-type': 'application/json'})
    })
}