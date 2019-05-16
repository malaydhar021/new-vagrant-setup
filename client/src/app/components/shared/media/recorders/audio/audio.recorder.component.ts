import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MediaService } from '../../../../../services/media.service';
import { Log } from '../../../../../helpers/app.helper';

/**
 * Component class to perform all sort of operations related to audio recording
 * @class AudioRecorderComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-audio-recorder',
  templateUrl: './audio.recorder.component.html',
  styleUrls: ['./audio.recorder.component.scss']
})
export class AudioRecorderComponent implements OnInit, OnDestroy {
  idx: string = 'audio_review_recorder';
  player: any = false;
  @Input() height?: number = null; // height of the audio recorder
  @Input() width?: number = null; // width of the audio recorder


  // configuration for videojs-record plugin
  configPluginsRecord: any = {
    audio: true,
    video: false,
    maxLength: 300,
    msDisplayMax: 10,
    debug: false,
  };

  // configuration for videojs-wavesurfer plugin
  configPluginsWavesurfer: any = { 
    src: 'live',
    waveColor: '#36393b',
    progressColor: 'black',
    debug: false,
    cursorWidth: 1,
    msDisplayMax: 20,
    hideScrollbar: true
  }
  // main configuration for videojs with videojs-wavesurfer and videojs-record plugins
  config = {
    controls: true,
    fluid: false,
    loop: false,
    width: 320,
    height: 240,
    controlBar: {
      volumePanel: false
    },
    plugins: {
      wavesurfer: this.configPluginsWavesurfer,
      record: this.configPluginsRecord
    }
  };

  /**
   * @constructor constructor
   * @param mediaService MediaService instance
   */
  constructor(private mediaService: MediaService) {}

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
    this.setConfig();
    // initialize the player using media service
    this.mediaService.initPlayer(this.idx, this.config);
    // assign the player to `player` property
    this.player = this.mediaService.player;
    // Log.info(this.player, "log player in audio component");
    // execute the media callback events
    this.mediaService.mediaEvents();
  }

  /**
   * Method to override the default config
   * @method setConfig
   * @since Version 1.0.0
   * @returns Void
   */
  public setConfig() {
    if(this.height !== null) {
      this.config.height = this.height;
    }
    if(this.width !== null) {
      this.config.width = this.width;
    }
  }

  /**
   * @method ngOnDestroy
   * @since Version 1.0.0
   * @returns Void
   */
  public ngOnDestroy(): void {
    this.mediaService.disposePlayer();
    this.player = false;
  }
}
