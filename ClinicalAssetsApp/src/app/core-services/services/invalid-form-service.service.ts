import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConstantVariables } from './constant-variable';

@Injectable({
    providedIn: 'root',
})
export class InvalidFormServiceService {
    getFirstInvalidControl(formName: FormGroup): boolean {
        const controls = formName.controls;
        for (const controlName in controls) {
            if (controls.hasOwnProperty(controlName)) {
                const control: any = formName.get(controlName);

                if (control?.controls) {
                    const controls2 = control?.controls
                    for (let i = 0; i < controls2.length; i++) {
                        for (const controlname in controls2[i].controls) {
                            if (controls2[i].controls.hasOwnProperty(controlname)) {
                                if (this.focusOnNextInvalidControl(controlname, controls2, controlName)) {
                                    return true
                                }
                            }
                        }
                    }
                }
                if (control?.invalid) {
                    const inputElement = document.querySelector(`[formControlName="${controlName}"]`) as HTMLElement;
                    inputElement.focus();
                    inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return true
                }
            }
        }
        return false;
    }

    private focusOnNextInvalidControl(controlName: string, form: any, ExpandPanelId: any): boolean {
        const formControls = document.querySelectorAll(`[formControlName="${controlName}"]`);
        for (let i = 0; i < formControls.length; i++) {
            const formControl = formControls[i] as HTMLInputElement;
            const formControlName22: any = formControl.getAttribute('formControlName')
            const formControlElement = form[i]?.get(formControlName22);
            if (formControlElement && formControlElement.invalid) {
                //click it if it is expantion pannel       
                document.getElementById(ExpandPanelId)?.click()
                formControl.focus();
                formControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return true;
            }
        }
        return false
    }

    formatPhoneNumberForFormArray(form: any, formArrayName: string, formControlName: string, i: number) {
        const FormArray: any = form.get(formArrayName).controls
        let formattedNumber = FormArray[i].value[formControlName].replace(/\D/g, '');
        formattedNumber = formattedNumber.replace(ConstantVariables.MobileNoPattern, ConstantVariables.SpaceInMobileNo);
        FormArray[i].controls[formControlName].setValue(formattedNumber);

        // the following code is important for if client want (),- at the time he/she is typing number
        // if (formattedNumber.length >= 3) {
        //   formattedNumber = formattedNumber.replace(/(\d{3})/, '$1 ');
        // }
        // if (formattedNumber.length >= 7) {
        //   formattedNumber = formattedNumber.replace(/(\d{3})\s(\d{3})/, '$1 $2 ');
        // }
    }

    formatPhoneNumber(form: any, formControlName: string) {
        let formattedNumber = form.value[formControlName].replace(/\D/g, '');
        formattedNumber = formattedNumber.replace(ConstantVariables.MobileNoPattern, ConstantVariables.SpaceInMobileNo);
        form.controls[formControlName].setValue(formattedNumber);
    }

    formatSSNNumber(form: any, formControlName: string) {
        let formattedSSN = form.value[formControlName].replace(/\D/g, '');
        formattedSSN = formattedSSN.replace(ConstantVariables.SSNNoPattern, ConstantVariables.SSN);
        form.controls[formControlName].setValue(formattedSSN);
    }

    ChangeToPattern(phone: any) {
        let number = phone?.replace(/\D/g, '');
        if (number?.length == 10) {
            return number?.replace(ConstantVariables.MobileNoPattern, ConstantVariables.SpaceInMobileNo)
        }
        return phone
    }

    ChangeToNumber(phone: any) {
        let number = phone
        return number?.replace(ConstantVariables.ChangeMobileToNumber, "")
    }

    ChangeToSSNPattern(ssn: any) {
        let number = ssn?.replace(/\D/g, '');
        if (number?.length == 9) {
            return number?.replace(ConstantVariables.SSNNoPattern, ConstantVariables.SSN)
        }
        return ssn;
    }

    ChangeToSSNNumber(ssn: any) {
        let number = ssn
        return number?.replace(ConstantVariables.ChangeSSNToNumber, "")
    }

    setMiddleInitial(controlName: string, from: FormGroup, event: any) {

        if (event.target.value) {
            if (event.target.value.length == 1) {
                if (event.inputType === 'deleteContentBackward') {
                    return
                }
                let value = event.target.value.toUpperCase() + "."
                from.controls[controlName].setValue(value);
            } else if (event.target.value.length == 2) {
                if (event.target.value.includes(".")) {
                    return
                } else {
                    let value = (event.target.value.substring(0, event.target.value.length - 1)).toUpperCase() + "."
                    from.controls[controlName].setValue(value);
                }
            }
        }
    }

    setMiddleInitialForFormArray(i: number, controlName: string, formArrayName: string, form: any, event: any) {
        const FormArray: any = form.get(formArrayName).controls
        if (event.target.value) {
            if (event.target.value.length == 1) {
                if (event.inputType === 'deleteContentBackward') {
                    return
                }
                let value = event.target.value.toUpperCase() + "."
                FormArray[i].controls[controlName].setValue(value);
            } else if (event.target.value.length == 2) {
                if (event.target.value.includes(".")) {
                    return
                } else {
                    let value = (event.target.value.substring(0, event.target.value.length - 1)).toUpperCase() + "."
                    FormArray[i].controls[controlName].setValue(value);
                }
            }
        }
    }
}
