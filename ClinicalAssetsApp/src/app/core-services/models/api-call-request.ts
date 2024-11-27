export interface IApiCallRequestDto {
    id: string;
    url: string;
    start: Date;
    timeElapsed?: number;
}