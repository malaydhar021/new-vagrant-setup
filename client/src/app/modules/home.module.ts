import { NgModule }                                       from '@angular/core';
import { CommonModule }                                   from '@angular/common';
import { ReactiveFormsModule, FormsModule }               from '@angular/forms';
import { NgxMaskModule }                                  from 'ngx-mask';
import { OwlDateTimeModule, OwlNativeDateTimeModule }     from 'ng-pick-datetime';
import { NgScrollbarModule }                              from 'ngx-scrollbar';
import { BarRatingModule }                                from 'ngx-bar-rating';
import { NgxSmartModalModule }                            from 'ngx-smart-modal';
/** custom imports */
import { HomeRoutingModule }                              from './routes/home.route.module'; // dashboard routing module
// importing components
import { HomeComponent }                                  from '../components/home/home.component';
import { LeftPanelComponent }                             from '../components/home/shared/left-panel/left-panel.component';
import { HeaderComponent }                                from '../components/home/shared/header/header.component';
//importing module
import { MessageModule}                                   from './message.module';
// importing services
import { ColorPickerModule }                              from 'ngx-color-picker';
import { MenuService }                                    from '../services/menu.service';
import { MediaModule }                                    from './media.module';
import { MediaService }                                   from '../services/media.service';
import { NgxPaginationModule }                            from 'ngx-pagination';
import { SharedModule }                                   from './shared/shared.module';

/**
 * HomeModule is loading all components and services along with few angular modules once the user is logged in.
 * @class HomeModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    HomeComponent,
    LeftPanelComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HomeRoutingModule,
    NgScrollbarModule,
    BarRatingModule,
    NgxSmartModalModule.forRoot(),
    NgxMaskModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MessageModule,
    ColorPickerModule,
    MediaModule,
    NgxPaginationModule,
    SharedModule
  ],
  providers: [
    MenuService,
    MediaService
  ]
})
export class HomeModule { }
