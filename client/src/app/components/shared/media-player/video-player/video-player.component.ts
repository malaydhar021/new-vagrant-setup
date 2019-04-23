import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaPlayerService } from '../../../../services/media-player.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {
  src: string = null;
  subscription: Subscription;

  constructor(private mediaPlayerService: MediaPlayerService) { 
    this.subscription = this.mediaPlayerService.videoSrc$.subscribe(
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
