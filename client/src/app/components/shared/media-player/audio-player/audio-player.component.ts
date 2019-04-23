import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaPlayerService } from '../../../../services/media-player.service';
import { Subscription } from 'rxjs';

/**
 * @class AudioPlayerComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  src: string = null;
  subscription: Subscription;

  constructor(private mediaPlayerService: MediaPlayerService) { 
    this.subscription = this.mediaPlayerService.audioSrc$.subscribe(
      src => {
        this.src = src;
      }
    );
  }

  public ngOnInit() {}

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
