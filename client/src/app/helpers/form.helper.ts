import { FormGroup } from '@angular/forms';
import { Log } from './app.helper';

/**
 * MustMatch constant is a custom validator which will be checking with if the 2nd argument is match with the 1st argument or not.
 * This validator will be used mainly for password and confirm password but this can be used to compare between two string to check
 * whether they both are same or not.
 * 
 * @constant MustMatch
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @param controlName (string) Main string
 * @param matchingControlName (string) The string to match with controlName
 * @license Proprietary
 */
export const MustMatch = (controlName: string, matchingControlName: string) => {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}

/**
 * MinLength constant to check the minimun length of a string.
 * @constant MinLength
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @param controlName (string) String to check the length
 * @license Proprietary
 */
export const MinLength = (controlName: string) => {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    if (control.errors && !control.errors.minlength) {
      // return if another validator has already found an error on the matchingControl
      return;
    }
    Log.info(control.value.length, 'check password length in control password');
    // set error on control if validation fails
    if (control.value.length < 8) {
      control.setErrors({ minlength: true });
    } else {
      control.setErrors(null);
    }
  }
}