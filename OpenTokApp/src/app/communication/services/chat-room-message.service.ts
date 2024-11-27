import { Injectable } from "@angular/core";
import { GenericApiService } from "@core-services";
import { Observable } from "rxjs";

import { IChatRoomMessageDto } from "../models";

@Injectable({
    providedIn: 'root',
})
export class ChatRoomMessageService {
    constructor(private readonly _genericApiService: GenericApiService) { }

    addChatRoomMessage<T>(model: IChatRoomMessageDto): Observable<T> {
        return this._genericApiService.post<T>('api/ChatRoomMessage/AddChatRoomMessage', model, false);
    }

    getChatRoomMessages<T>(appointmentId: number): Observable<T> {
        return this._genericApiService.get<T>(`api/ChatRoomMessage/GetChatRoomMessages/${appointmentId}`, null, false);
    }
}