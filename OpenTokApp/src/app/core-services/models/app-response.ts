export interface IAppResponseDto {
    isSuccess: boolean;
    message: string;
    statusCode?: number;
    data?: any
} 