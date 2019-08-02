import { NgModule }                         from '@angular/core';
import { RouterModule }                     from '@angular/router';
import { NotFoundComponent }                from 'src/app/components/not-found/not-found.component';
import { CommonModule } from '@angular/common';

/**
 * Module that exports NotfoundComponent so that other module can use this component
 * @module NotFoundModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NotFoundComponent,
  ],
  providers: []
})
export class NotFoundModule { }