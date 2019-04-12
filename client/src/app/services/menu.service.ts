import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Log } from '../helpers/app.helper';

/**
 * MenuService 
 *
 * @package MenuService
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 2.0.0
 * @license Proprietary
 */
@Injectable()
export class MenuService {
  // declaring varient of Subject for active menu
  private menuSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  activeMenu$: Observable<boolean> = this.menuSubject.asObservable();


  /**
   * Method to update the error message from http request asynchronously
   * @method updateMessage
   * @since version 2.0.0
   * @param message (string) Error message
   * @returns Observable<String>
   */
  public updateStatus(status: boolean) {
    Log.notice(status, 'Message from menu service');
    this.menuSubject.next(status);
  }
}
