export interface ErrorData {
    ok: false;
}

export interface SuccessData<T> {
    ok: true;
    data: T
}

export type Response<T> = SuccessData<T> | ErrorData