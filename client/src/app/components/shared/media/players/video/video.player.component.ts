import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaService } from '../../../../../services/media.service';
import { LoaderService } from '../../../../../services/loader.service';
import { Log } from '../../../../../helpers/app.helper';


/**
 * Component to deal with all sort of operations related to video player
 * @class VideoPlayerComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @todo Need to work on constructor of this class.
 * @license Proprietary
 */
@Component({
  selector: 'app-video-player',
  templateUrl: './video.player.component.html',
  styleUrls: ['./video.player.component.scss']
})
export class VideoPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() source?: string = null; // video player source
  @Input() height?: number = null; // height of the video recorder
  @Input() width?: number = null; // width of the video recorder

  idx: string = 'video_review_player';
  player: any = false;
  subscription: Subscription;
  url: string = null; // source url of video file 
  // video.js configuration
  config = {
    controls: true,
    autoplay: true,
    fluid: false,
    loop: false,
    width: 320,
    height: 240,
    debug: true
  };

  /**
   * Constructor method in emit the current value of video source while it has been
   * updated from different part of the application
   * @constructor constructor
   * @since Version 1.0.0
   * @param mediaService MediaService instance
   * @param loaderService LoaderService instance
   * @todo Need to remove setTimeout from this subscription and load the video asynchronously. 
   * Also need to remove the loader from this subscription as well.
   * @returns Void
   */
  constructor(private mediaService: MediaService, private loaderService: LoaderService) { 
    this.subscription = this.mediaService.videoSrc$.subscribe(
      src => {
        this.url = src;
        // this block of code should be replaced
        if(this.url !== null) {
          this.loaderService.enableLoader();
          setTimeout(() => {
            this.loaderService.disableLoader();
            this.playerInAction();
          }, 500);
        }
        // end of code block
      }
    );
  }

  /**
   * @method playerInAction
   * @since Version 1.0.0
   * @returns Void
   */
  public playerInAction() {
    if(!this.player) {
      this.initVideoPlayer();
    } else {
      this.mediaService.loadVideo(this.url);
    }
  }

  /**
   * @method ngOnInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnInit() {
    this.url = (this.source !== null) ? this.source : this.url;
  }

  /**
   * @method ngOnDestroy
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.mediaService.disposePlayer();
    this.player = false;
  }

  /**
   * @method ngAfterViewInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngAfterViewInit() {
    this.initVideoPlayer();
  }

  /**
   * Method to initialize player with the help of media service
   * @method initVideoPlayer
   * @since Version 1.0.0
   * @returns Void
   */
  public initVideoPlayer() {
    if(this.url !== null || this.source !== null) {
      this.config.autoplay = (this.source !== null) ? false : true;
      Log.info(this.config.autoplay, "log autoplay in config");
      if(this.height !== null) {
        this.config.height = this.height;
      }
      if(this.width !== null) {
        this.config.width = this.width;
      }
      this.mediaService.initPlayer(this.idx, this.config);
      this.player = this.mediaService.player;
      this.mediaService.mediaEvents();
    }
  }
}