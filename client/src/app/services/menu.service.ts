import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * MenuService will be responsible for opening / closing drawer menu for responsive devices
 * @class MenuService
 * @author Tier5 LLC `<work@tier5.us>`
 * @version 2.0.0
 * @license Proprietary
 */
@Injectable()
export class MenuService {
  // declaring varient of Subject for active drawer menu
  private menuSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  activeMenu$: Observable<boolean> = this.menuSubject.asObservable();

  // declaring varient of Subject for active drawer
  private drawerSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  drawer$: Observable<boolean> = this.drawerSubject.asObservable();

  /**
   * Method to update drawer menu for different devices mainly for responsive
   * @method updateStatus
   * @since version 1.0.0
   * @param status (boolean) Status
   * @returns Observable<Boolean>
   */
  public updateStatus(status: boolean) {
    this.menuSubject.next(status);
  }

  /**
   * Method to update drawer for different devices mainly for responsive
   * @method updateDrawerStatus
   * @since version 2.0.0
   * @param status (boolean) Status
   * @returns Observable<Boolean>
   */
  public updateDrawerStatus(status: boolean) {
    this.drawerSubject.next(status);
  }
}
