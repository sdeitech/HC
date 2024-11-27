export interface IAppResponseDataDto<T> {
    data: T;
    isSuccess: boolean;
    message: string;
    statusCode?: number;
} 