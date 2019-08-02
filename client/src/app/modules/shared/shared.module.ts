import { NgModule }                         from '@angular/core';
import { DigitsOnlyDirective }              from '../../directives/digits-only.directive';

/**
 * Module to hold all the common component or directives or services which are required in other modules as well
 * @module SharedModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    DigitsOnlyDirective,
  ],
  imports: [],
  exports: [
    DigitsOnlyDirective,
  ],
  providers: []
})
export class SharedModule { }