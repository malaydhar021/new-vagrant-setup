import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent }from '../components/shared/message/message.component';

/**
 * Module to show api error messages along with success messages
 * @module MessageModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    MessageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MessageComponent
  ]
})
export class MessageModule {}
