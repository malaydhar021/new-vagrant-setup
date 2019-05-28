import { FormGroup, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { Log, Utilities } from './app.helper';
import {ReviewLinkService} from '../services/review-link.service';

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
 * MinLength constant to check the minimum length of a string.
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
 * whether the value is integer or not. It set a custom error object named `invalidNumber`
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
 * provided max and min numbers. It accepts formControl field name and min and max digits
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
/**
 * Constant to check filetype of a file. This constant is incomplete.
 * @constant FileType
 * @todo Need to implement the core logic to 
 * @param controlName FormControlName
 * @param file The file for checking the filetype
 * @returns ValidationErrors
 */
export const FileType = (controlName: string, file: File, allowedFileTypes: string[]): any => {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    if(control.errors && !control.errors.invalidFileType) {
      // return if another validator has already found an error on the control
      return;
    }
    // checking if there is any file or not
    if(file === null) {
      // checking if there is any file or not
      return;
    }
    Log.debug(file.type, "Checking file type for uploaded file");
    if(allowedFileTypes.indexOf(file.type) === -1) {
      // set file to null
      file = null;
      // set error on control if validation fails
      control.setErrors({invalidFileType: true});
    } else {
      // there is no errors i.e data has passed the validation
      control.setErrors(null);
    }
    
  }
}

/**
 * Constant to check file size of a file.
 * @constant FileSize
 * @param controlName FormControlName
 * @param file The file to check the size
 * @returns ValidationErrors
 */
export const FileSize = (controlName: string, file: File, maxSize: number, unit: string = 'KB'): any => {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    if(control.errors && !control.errors.invalidFileSize) {
      // return if another validator has already found an error on the control
      return;
    }
    // checking if there is any file or not
    if(file === null) {
      // return if there is no file
      return;
    }
    // log the file data
    Log.debug(file.name, 'File Name');
    // logging file size in {{unit}}
    Log.debug(Utilities.bytesToAny(file.size, unit) + ' ' + unit, " File Size " + unit);
    // checking if file size matches the condition
    if(Utilities.bytesToAny(file.size, unit) > maxSize) {
      // set file to null
      file = null;
      // set error on control if validation fails      
      control.setErrors({invalidFileSize: true});
    } else {
      // there is no errors i.e data has passed the validation
      control.setErrors(null);
    }
  }
}

/**
 * Function to validate checkboxes generated by formArray controls. This method has been used to
 * validate update reviews from campaign listing page if there is no review has been selected
 * @function MinimumCheckedCheckboxes
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @param min Minimum number of check boxes need to be selected
 * @license Proprietary
 */
export function MinimumCheckedCheckboxes(min:number = 1) {
  const validator: ValidatorFn = (formArray: FormArray) => {
    const totalSelected = formArray.controls
      // get a list of checkbox values (boolean)
      .map(control => control.value)
      // total up the number of checked check boxes
      .reduce((prev, next) => next ? prev + next : prev, 0);

    // if the total is not greater than the minimum, return the error message
    return totalSelected >= min ? null : { required: true };
  };
  return validator;
}
