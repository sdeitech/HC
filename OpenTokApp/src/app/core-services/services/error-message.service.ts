import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { StatusCode, StatusCodeMessages } from '../config';

@Injectable({
    providedIn: 'root',
})
export class ErrorMessageService {
    getMessage = (error: HttpErrorResponse): string => {
        if (error
            && error.status === StatusCode.UserDefinedException
            && error.error
            && error.error.Message
            && error.error.Message[0])
            return error.error.Message[0];

        if (error
            && error.status === StatusCode.UserDefinedException
            && error.error
            && error.error.Error)
            return error.error.Error;

        if (error
            && error.status === StatusCode.BadRequest
            && error.error
            && Object.keys(error.error).some(x => true)) {
            const keys = Object.keys(error.error);
            const messages: string[] = [];

            keys.forEach(key => {
                const obj = error.error[key];

                if (Array.isArray(obj))
                    messages.push(obj.join(' '));
            });

            if (messages && messages.length > 0)
                return messages.join(' ');
        }

        if (error) {
            const errorMap = StatusCodeMessages.filter(x => x.code === error.status)[0];

            if (errorMap)
                return errorMap.message;
        }

        return 'Error while proccessing request.';
    }
}