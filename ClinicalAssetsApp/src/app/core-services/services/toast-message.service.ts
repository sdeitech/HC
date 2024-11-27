import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { IMessageDto, IMessageRequestDto } from "../models";

@Injectable({
    providedIn: 'root',
})
export class ToastMessageService {
    private readonly messageSentSubject = new Subject<IMessageRequestDto>();
    private readonly messageSentObs$ = this.messageSentSubject.asObservable();

    add(message: IMessageDto, isClear: boolean = true) {
        const toastMessage: IMessageRequestDto = {
            message: message,
            isClear: true
        };

        this.messageSentSubject.next(toastMessage);
    }

    getMessageSentListener() {
        return this.messageSentObs$;
    }
}