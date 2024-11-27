import { Injectable } from "@angular/core";
import { GenericApiService, IPageFilterDto } from "@core-services";
import { Observable } from "rxjs";

import { IChatConnectedUserDto } from "../models";

@Injectable({
    providedIn: 'root',
})
export class ChatConnectedUserService {
    constructor(private readonly _genericApiService: GenericApiService) { }

    addChatConnectedUser<T>(model: IChatConnectedUserDto): Observable<T> {
        return this._genericApiService.post<T>('api/ChatConnectedUser/AddChatConnectedUser', model, false);
    }

    updateChatConnectedUser<T>(model: IChatConnectedUserDto): Observable<T> {
        return this._genericApiService.post<T>('api/ChatConnectedUser/UpdateChatConnectedUser', model, false);
    }

    getChatConnectedUserList<T>(model: IPageFilterDto): Observable<T> {
        return this._genericApiService.post<T>('api/ChatConnectedUser/GetChatConnectedUserList', model, false);
    }

    getChatConnectedUserById<T>(id: any): Observable<T> {
        return this._genericApiService.get<T>(`api/ChatConnectedUser/GetChatConnectedUserById/${id}`, false);
    }

    getChatConnectedUserByUserId<T>(userId: number): Observable<T> {
        return this._genericApiService.get<T>(`api/ChatConnectedUser/GetChatConnectedUserByUserId/${userId}`, false);
    }

    deleteChatConnectedUser<T>(userId: any): Observable<T> {
        return this._genericApiService.post<T>(`api/ChatConnectedUser/DeleteChatConnectedUser/${userId}`, null);
    }
}