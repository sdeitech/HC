import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calculateAge'
})
export class CalculateAgePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value == null || value === '') {
      return '';
    }

    const today = new Date();
    const birth = new Date(value);

    let ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();

    if (today.getDate() < birth.getDate()) {
      ageInMonths--;
    }

    if (ageInMonths >= 12) {
      const ageInYears = Math.floor(ageInMonths / 12);
      if (ageInYears > 0) {
        if (ageInYears > 150) {
          return '';
        }
        return `${ageInYears}yo`;
      }
      else {
        return '';
      }
    } else if (ageInMonths > 0) {
      if (ageInMonths > 0) {
        return `${ageInMonths}mo`;
      }
      else {
        return '';
      }
    } else {
      const ageInDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
      if (ageInDays >= 0) {
        return `${ageInDays}d`;
      }
      else {
        return '';
      }
    }
  }
}