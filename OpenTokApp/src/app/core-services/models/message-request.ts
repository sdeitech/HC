import { IMessageDto } from "./message";

export interface IMessageRequestDto {
    message: IMessageDto;
    isClear: boolean;
}