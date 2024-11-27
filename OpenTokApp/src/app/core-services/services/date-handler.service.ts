import { Injectable } from "@angular/core";
import { DateTransformationService } from "./date-transformation.service";

@Injectable({
    providedIn: 'root',
})
export class DateHandlerService {
    constructor(
        private readonly _dateTransformationService: DateTransformationService
    ) { }

    handleDate = (model: any): any => {
        const transformingISODateFormat = 'yyyy-MM-ddTHH:mm:ss.000';

        if (!model || (typeof model !== 'object'))
            return model;

        Object.keys(model)
            .forEach(key => {
                const value = model[key];
                if (this.isDateObject(value)) {
                    model[key] = this._dateTransformationService.transformDate(value, transformingISODateFormat);
                } else if (typeof value === 'object') {
                    this.handleDate(value);
                }
            });

        return model;
    }

    private isDateObject = (value: any | null | undefined): boolean => {
        if (!value)
            return false;

        const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?Z$/;

        if ((typeof value === "string" && isoDateFormat.test(value))
            || (typeof value?.getMonth === 'function'))
            return true;

        return false;
    }
}