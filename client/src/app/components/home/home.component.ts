import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SubscriptionService } from '../../services/subscription.service';

/**
 * This component is the wrapper component for all components which are showing
 * once the user is logged in. This component checks user current subscription status
 * @class HomeComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  /**
   * Constructor method to load few services at the very first when this class got initialized
   * @constructor constructor
   * @since Version 1.0.0
   * @param title Title service instance
   * @param subscriptionService SubscriptionService instance
   * @returns Void
   */
  constructor(private title: Title, private subscriptionService: SubscriptionService) { 
    // check the current user subscription
    this.subscriptionService.checkSubscription();
  }

  /**
   * Method to set the title of the page and check the user current subscription status
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnInit() {
    this.title.setTitle('Stickyreviews :: Home');
    // this.subscriptionService.checkSubscription();
  }
}