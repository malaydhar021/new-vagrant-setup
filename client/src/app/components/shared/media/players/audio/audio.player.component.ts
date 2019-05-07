import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MediaService } from '../../../../../services/media.service';
import { Log } from '../../../../../helpers/app.helper';
import { Subscription } from 'rxjs';

/**
 * Component class to perform all sort of operations related to audio player
 * @class AudioPlayerComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-audio-player',
  templateUrl: './audio.player.component.html',
  styleUrls: ['./audio.player.component.scss']
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  @Input() source?: string = null;
  private idx: string = 'audio_review_player';
  private player: any = false;
  private subscription: Subscription;
  private audioSrc: string = null;
  // configuration for videojs-wavesurfer plugin
  private configPluginsWavesurfer: any = { 
    src: '',
    waveColor: '#36393b',
    progressColor: 'black',
    debug: true,
    cursorWidth: 1,
    msDisplayMax: 20,
    hideScrollbar: true
  }
  // main configuration for videojs with videojs-wavesurfer and videojs-record plugins
  private config = {
    controls: true,
    autoplay: true,
    fluid: true,
    loop: false,
    width: 320,
    height: 240,
    plugins: {
      wavesurfer: this.configPluginsWavesurfer
    }
  };

  /**
   * @constructor constructor
   * @param mediaService MediaService instance
   */
  constructor(private mediaService: MediaService) {
    this.subscription = this.mediaService.audioSrc$.subscribe(
      src => {
        this.audioSrc = src;
        if(!this.player) {
          this.ngAfterViewInit();
        } else {
          this.mediaService.updateWavesurferSrc(this.audioSrc);
        }
      }
    );
  }

  /**
   * @method ngOnInit
   */
  public ngOnInit() {}

  /**
   * @method ngAfterViewInit
   * @since Version 1.0.0
   * @returns Void
   */
  public ngAfterViewInit() {
    if(this.audioSrc !== null || this.source !== null) {
      this.config.plugins.wavesurfer.src = (this.source !== null) ? this.source : this.audioSrc;
      this.config.autoplay = (this.source !== null) ? false : true;
      // initialize the player using media service
      this.mediaService.initPlayer(this.idx, this.config);      
      // assign the player to `player` property
      this.player = this.mediaService.player;
      // execute the media callback events
      this.mediaService.mediaEvents();
    }    
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
}