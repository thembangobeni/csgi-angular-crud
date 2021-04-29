export interface AjaxResponse<T> {
    success : boolean,
    errorMessage? : string,
    data : T
}