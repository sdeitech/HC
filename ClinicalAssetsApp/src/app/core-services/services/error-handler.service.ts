import { Injectable } from "@angular/core";
import { ToastMessageService } from "./toast-message.service";
import { ErrorMessageService } from "./error-message.service";

@Injectable({
    providedIn: 'root',
})
export class ErrorHandlerService {

    constructor(
        private readonly _toastMessageService: ToastMessageService,
        private readonly _errorMessageService: ErrorMessageService
    ) { }

    handleError(error: any) {
        this._toastMessageService
            .add({
                severity: 'error',
                summary: 'Error',
                detail: this._errorMessageService.getMessage(error)
            });
    }

}