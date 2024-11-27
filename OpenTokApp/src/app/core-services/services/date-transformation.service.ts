import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DateTransformationService {
    constructor(private readonly _datePipe: DatePipe) { }

    transformDate(date: Date | string | undefined | null, dateFormat: string) {
        return this._datePipe.transform(date, dateFormat);
    }
}