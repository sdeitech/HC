import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumber'
})
export class PhoneNumberPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return value;
    }

    const cleanedValue = value.replace(/\D/g, ''); // Remove non-digit characters

    if (cleanedValue.length === 10) {
      return `(${cleanedValue.slice(0, 3)}) ${cleanedValue.slice(3, 6)}-${cleanedValue.slice(6)}`;
    }

    // Return the original value if it doesn't match the expected format
    return value;
  }
}

