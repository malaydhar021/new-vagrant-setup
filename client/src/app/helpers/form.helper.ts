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
 * This is not in use for now.
 * @constant MinLength
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @param controlName (string) String to check the length
 * @license Proprietary
 */
export const MinLength = (controlName: string) => {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    // check if this control already has some errors or not
    if (control.errors && !control.errors.minlength) {
      // return if another validator has already found an error on the control
      return;
    }
    // set error on control if validation fails
    if (control.value.length < 8) {
      control.setErrors({ minlength: true });
    } else {
      control.setErrors(null);
    }
  }
}

/**
 * IsNumeric constant as the name itself saying it will check whether the value is
 * numeric or not. This constant accepts formControl field name and check the value
 * wheter the value is interger or not. It set a custom error object named `invalidNumber`
 * which will be true if validation fails else there will be no error object like `invalidNumber`.
 * @constant IsNumeric
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @param controlName (String) Name of the field
 * @license Proprietary 
 */
export const IsNumeric = (controlName: string) => {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];

    if (control.errors && !control.errors.invalidNumber) {
      // return if another validator has already found an error on the control
      return;
    }

    // set error on control if validation fails
    if (isNaN(control.value) === true) {
      control.setErrors({ invalidNumber: true });
    } else {
      control.setErrors(null);
    }
  }
}

/**
 * InRange constant is going to check if the value of a field is in between
 * provided max and min mumbers. It accepts formControl field name and min and max digits
 * which is going to be allowed. It set one custom error object called `invalidLength`
 * which will be true if the validation fails else there will be no errors.
 * @constant InRange
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @param controlName (String) FormControl name of the field
 * @param min (Number) Minimum length allowed
 * @param max (Number) Maximum length allowed
 * @returns Error | Null
 * @license Proprietary 
 */
export const InRange = (controlName: string, min: number, max: number) => {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];

    if(control.errors && !control.errors.invalidLength) {
      // return if another validator has already found an error on the control
      return;
    }
    // set error on control if validation fails
    if(control.value.length < min || control.value.length > max) {
      Log.debug('is it coming here?');
      control.setErrors({ invalidLength: true });
    } else {
      control.setErrors(null);
    }
  }
}