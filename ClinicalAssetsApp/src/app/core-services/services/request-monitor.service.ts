import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { IApiCallRequestDto } from "../models";

@Injectable({
    providedIn: 'root',
})
export class RequestMonitorService {
    private apiCallRequests: IApiCallRequestDto[] = [];
    private readonly _isApiCallRequestSubject = new Subject<IApiCallRequestDto[]>();
    private readonly _isApiCallRequestObs$ = this._isApiCallRequestSubject.asObservable();

    getApiCallRequestListener() {
        return this._isApiCallRequestObs$;
    }

    setApiCallRequest(list: IApiCallRequestDto[]) {
        this.apiCallRequests = list;
        this._isApiCallRequestSubject.next(list);
    }

    getApiCallRequests() {
        return this.apiCallRequests;
    }
}