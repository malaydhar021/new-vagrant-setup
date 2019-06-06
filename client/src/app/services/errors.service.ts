import { Injectable } from '@angular/core';
import { Log } from '../helpers/app.helper';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * ErrorsService is responsible to collect all errors and store it into errros array.
 * It users variant of Subject that requires an initial value and emits its current 
 * value whenever it is subscribed to. This is handling all kind of error messages
 * along with form validation messages which is validated by api request.
 *
 * @package ErrorsService
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 2.0.0
 * @license Proprietary
 */
@Injectable()

export class ErrorsService {
  // this property was in use previously but not it's not been used
  errors: string[] = []; // deprecated

  // declaring varient of Subject for error message
  private errorSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  error$: Observable<string> = this.errorSubject.asObservable();

  // declaring varient of Subject for validation error messages
  private validationErrorsSubject: BehaviorSubject<any> = new BehaviorSubject<any>('');
  validationErrors$: Observable<any> = this.validationErrorsSubject.asObservable();

  // declaring varient of Subject for validation error messages
  private showMessageSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showMessage$: Observable<boolean> = this.showMessageSubject.asObservable();

  /**
   * Method to update the error message from http request asynchronously
   * @method updateMessage
   * @since version 2.0.0
   * @param message (string) Error message
   * @returns Observable<String>
   */
  public updateMessage(message: string) {
    this.errorSubject.next(message);
    this.updateShowMessageStatus(true);
  }

  /**
   * Method to update validation error message from http request asynchronously
   * @method updateValidationMessage
   * @since version 2.0.0
   * @param message (any) Validation error messages
   * @returns Observable<Any>
   */
  public updateValidationMessage(validationMessages: any) {
    this.validationErrorsSubject.next(validationMessages);
    this.updateShowMessageStatus(true);
  }

  /**
   * Method to update show error message status from anywhere
   * @method updateShowMessageStatus
   * @since Version 2.0.0
   * @param status Current status of show message
   * @returns Observable<boolean>
   */
  public updateShowMessageStatus(status: boolean = false) {
    this.showMessageSubject.next(status);
  }

  /**
   * Method to get all errors
   * ### *DEPRECATED*
   * @method getErrors
   * @since version 1.0.0
   * @deprecated in version 2.0.0
   * @returns array
   */
  public get getErrors() {
    return this.errors;
  }

  /**
   * Method to get all errors
   * ### *DEPRECATED*
   * @method setErrors
   * @since version 1.0.0
   * @deprecated in version 2.0.0
   * @param error (string) Error message
   * @returns void
   */
  public setErrors(error: string) {
    Log.info(error, 'Log in setErrors');
    this.errors.push(error);
  }

  /**
   * Method to clear all errors
   * ### *DEPRECATED*
   * @method clearErrors
   * @since version 1.0.0
   * @deprecated in version 2.0.0
   * @returns void
   */
  public clearErrors() {
    this.errors = [];
  }
}
