import { Component, OnInit, Input } from '@angular/core';
import { MediaService } from '../../../../../services/media.service';
import { Log } from '../../../../../helpers/app.helper';

/**
 * Component to deal with all sort of operations related to video recorder
 * @class VideoRecorderComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-video-recorder',
  templateUrl: './video.recorder.component.html',
  styleUrls: ['./video.recorder.component.scss']
})
export class VideoRecorderComponent implements OnInit {
  private idx: string = 'video_review_recorder'; // video recorder selector
  private player: any = false; // the player instance
  // video.js configuration with videojs-record plugin configuration
  private config = {
    controls: true,
    autoplay: false,
    fluid: false,
    loop: false,
    width: 320,
    height: 240,
    controlBar: {
      volumePanel: false
    },
    plugins: {
      // configure videojs-record plugin
      record: {
        audio: true,
        video: true,
        play: true,
        pause: true,
        maxLength: 300,
        msDisplayMax: 10,
        debug: true
      }
    }
  };

  /**
   * @constructor constructor
   * @since Version 1.0.0
   * @param mediaService MediaService instance
   * @returns Void
   */
  constructor(private mediaService: MediaService) { }

  /**
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnInit() {}

  /**
   * @method ngOnDestroy
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnDestroy() {}

  /**
   * @method ngAfterViewInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngAfterViewInit() {
    // initialize the video recorder with the selector element and config property
    this.mediaService.initPlayer(this.idx, this.config);
    // retrieve the player and assign it to `player` class property for future use
    this.player = this.mediaService.player;
    // log the player object for debugging
    Log.info(this.player, "log player in video component");
    // perform video recorder callback events
    this.mediaService.mediaEvents();
  }
}