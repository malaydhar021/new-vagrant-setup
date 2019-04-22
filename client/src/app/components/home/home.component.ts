import { Component, OnInit }    from '@angular/core';
import { Title }                from '@angular/platform-browser';
import { SubscriptionService }  from '../../services/subscription.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private title: Title, private subscriptionService: SubscriptionService) {}

  ngOnInit() {
      this.title.setTitle('Stickyreviews :: Dashboard');
      this.subscriptionService.checkSubscription();
  }

}
