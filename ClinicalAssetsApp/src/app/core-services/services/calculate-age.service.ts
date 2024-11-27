import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CalculateAgeService {

    constructor() { }

    calculateAgeValidation(form: any, controlName: any) {
        const dob = form.get(controlName)?.value;
        if (dob) {
            const birth = new Date(dob);

            if (isNaN(birth.getTime())) {
                return '';
            }

            const today = new Date();

            let ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();

            if (today.getDate() < birth.getDate()) {
                ageInMonths--;
            }

            if (ageInMonths >= 12) {
                const ageInYears = Math.floor(ageInMonths / 12);
                if (ageInYears > 150) {
                    form.get(controlName).setErrors({ 'invalidAge': true });
                    // You can display a validation message in the template if needed
                } else {
                    // this.calculatedAge = `${ageInYears}yo`;
                    form.get(controlName).setErrors(null);
                }

            } else if (ageInMonths > 0) {
                // this.calculatedAge = `${ageInMonths}mo`;
            } else {
                const ageInDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
                if (ageInDays > 0) {
                    // this.calculatedAge = `${ageInDays}d`;
                }
                else {
                    // this.calculatedAge = '';
                }
            }
        }
        return;
    }

    getAgeErrorMessage(form: any, controlName: any) {
        const dobControl = form.get(controlName);
        if(dobControl!=null){
            if (dobControl.hasError('invalidAge')) {
                return 'Age must be < 150';
            }
            return '';
        }
        return '';
    }

    // calculateAgeValidationForFormArray(form: any, formArrayName: string, controlName: string, i: number) {
    //     const FormArray: any = form.get(formArrayName).controls
    //     let dob = FormArray[i].value[controlName];
    //     if (dob) {
    //         const birth = new Date(dob);

    //         if (isNaN(birth.getTime())) {
    //             return '';
    //         }

    //         const today = new Date();

    //         let ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();

    //         if (today.getDate() < birth.getDate()) {
    //             ageInMonths--;
    //         }

    //         if (ageInMonths >= 12) {
    //             const ageInYears = Math.floor(ageInMonths / 12);
    //             if (ageInYears > 150) {
    //                 FormArray[i].get(controlName).setErrors({ 'invalidAge': true });
    //                 // You can display a validation message in the template if needed
    //             } else {
    //                 FormArray[i].get(controlName).setErrors(null);
    //             }

    //         } else if (ageInMonths > 0) {
    //         } else {
    //             const ageInDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    //             if (ageInDays > 0) {
    //             }
    //             else {
    //             }
    //         }
    //     }
    //     return;
    // }
    calculateAgeValidationForFormArray(
        form: any,
        formArrayName: string,
        controlName: string,
        i: number,
        patientDOB: string
      ) {
        const FormArray: any = form.get(formArrayName).controls;
        const guardianDOB = FormArray[i].value[controlName];
      
        if (guardianDOB) {
          const guardianBirth = new Date(guardianDOB);
          const patientBirth = new Date(patientDOB);
      
          if (isNaN(guardianBirth.getTime()) || isNaN(patientBirth.getTime())) {
            FormArray[i].get(controlName).setErrors({ invalidDate: true });
            return;
          }
      
          const today = new Date();
          let guardianAgeInMonths =
            (today.getFullYear() - guardianBirth.getFullYear()) * 12 +
            today.getMonth() -
            guardianBirth.getMonth();
          if (today.getDate() < guardianBirth.getDate()) {
            guardianAgeInMonths--;
          }
      
          let patientAgeInMonths =
            (today.getFullYear() - patientBirth.getFullYear()) * 12 +
            today.getMonth() -
            patientBirth.getMonth();
          if (today.getDate() < patientBirth.getDate()) {
            patientAgeInMonths--;
          }
      
          const guardianAgeInYears = Math.floor(guardianAgeInMonths / 12);
          const patientAgeInYears = Math.floor(patientAgeInMonths / 12);
      
          if (guardianAgeInYears <= patientAgeInYears) {
            FormArray[i].get(controlName).setErrors({ invalidGuardianAge: true });
          } else if (guardianAgeInYears > 150) {
            FormArray[i].get(controlName).setErrors({ invalidAge: true });
          } else {
            FormArray[i].get(controlName).setErrors(null);
          }
        }
      }

    getAgeErrorMessageForFormArray(form: any, formArrayName: string, controlName: string, i: number) {
        const FormArray: any = form.get(formArrayName).controls
        const dobControl = FormArray[i].get(controlName);
        if (dobControl.hasError('invalidAge')) {
            return 'Age must be < 150';
        }
        return '';
    }

}