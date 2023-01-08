
export interface TypedResponse<T = any> extends Response {
    json<P = T>(): Promise<P>;
}

export function typedFetch<T>(url: RequestInfo): Promise<TypedResponse<T>> {
    return fetch(url).then(data => data.json());
}
