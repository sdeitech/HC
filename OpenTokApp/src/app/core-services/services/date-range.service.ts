import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class DateRangeService {
    private readonly monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    getMonthYearRange = (month: number, year: number, monthRange: number) => {
        const range = [{
            displayText: `${this.monthNames[month].substring(0, 3)}-${year}`,
            month: month,
            year: year
        }];

        for (let x = 0; x < (monthRange - 1); x++) {
            month--;

            if (month < 0) {
                month = 11;
                year--;
            }

            range.push({
                displayText: `${this.monthNames[month].substring(0, 3)}-${year}`,
                month: month,
                year: year
            });
        }

        return range;
    }

    getDateRangeForMonth = (month: number, year: number): { firstDate: string, lastDate: string } => {
        const firstDate = new Date(year, month, 1, 0, 0, 0, 0);
        const lastDate = new Date(year, month, 1, 0, 0, 0, 0);

        lastDate.setMonth(lastDate.getMonth() + 1);
        lastDate.setSeconds(-1);

        return {
            firstDate: this.getFullDateString(firstDate),
            lastDate: this.getFullDateString(lastDate)
        };
    }

    private getFullDateString = (date: Date) => {
        const dateParts: string[] = [];

        dateParts.push(this.padStart(date.getFullYear(), 4));
        dateParts.push(`-${this.padStart((date.getMonth() + 1), 2)}`);
        dateParts.push(`-${this.padStart(date.getDate(), 2)}`);
        dateParts.push(`T${this.padStart(date.getHours(), 2)}`);
        dateParts.push(`:${this.padStart(date.getMinutes(), 2)}`);
        dateParts.push(`:${this.padStart(date.getSeconds(), 2)}`);

        return dateParts.join('');
    }

    private padStart = (value: number, padSize: number): string => {
        return value.toString().padStart(padSize, '0');
    }
}