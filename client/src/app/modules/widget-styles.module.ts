import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetStylesComponent } from '../components/home/shared/widget-styles/widget-styles.component';
import { RoundedComponent } from '../components/home/shared/widget-styles/rounded/rounded.component';
import { SquareComponent } from '../components/home/shared/widget-styles/square/square.component';
import { SquareElevatedComponent } from '../components/home/shared/widget-styles/square-elevated/square-elevated.component';
import { TearDropComponent } from '../components/home/shared/widget-styles/tear-drop/tear-drop.component';
import { TearDropElevatedComponent } from '../components/home/shared/widget-styles/tear-drop-elevated/tear-drop-elevated.component';

/**
 * Module to display different types of widget styles
 * @module WidgetStylesModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    WidgetStylesComponent,
    RoundedComponent,
    SquareComponent,
    SquareElevatedComponent,
    TearDropComponent,
    TearDropElevatedComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    WidgetStylesComponent
  ],
  providers: []
})
export class WidgetStylesModule { }
