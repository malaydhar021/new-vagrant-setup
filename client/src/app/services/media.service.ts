import { Injectable, ElementRef } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import videojs from 'video.js';
import * as adapter from 'webrtc-adapter/out/adapter_no_global.js';
import * as RecordRTC from 'recordrtc';
// the following imports are only needed when you're recording
// audio-only using the videojs-wavesurfer plugin
import WaveSurfer from 'wavesurfer.js';
import MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.js';
WaveSurfer.microphone = MicrophonePlugin;
// register videojs-wavesurfer plugin
import Wavesurfer from 'videojs-wavesurfer/dist/videojs.wavesurfer.js';
// register videojs-record plugin with this import
import * as Record from 'videojs-record/dist/videojs.record.js';
import { Log } from '../helpers/app.helper';

/**
 * Service to update the src of audio / video file to play it into audio / video player. Also
 * get configuration for video js for audio / video and recorder / player and initialize player
 * for audio / video accordingly
 * @class MediaPlayerService
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Injectable()
export class MediaService {
  // declaring variant of Subject audio src
  private audioSrcSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  audioSrc$: Observable<string> = this.audioSrcSubject.asObservable();

  // declaring variant of Subject video src
  private videoSrcSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  videoSrc$: Observable<any> = this.videoSrcSubject.asObservable();

  // declaring variant of Subject recorded file when audio|video recording will be finished
  private recordedFileSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  recordedFile$: Observable<any> = this.recordedFileSubject.asObservable();

  // reference to the element itself. used to access events and methods
  private _elementRef: ElementRef

  // index to create unique ID for component
  idx: string = null;

  private plugin: any;
  
  private _config: any;
  private _player: any = false;
  private _plugins: any = [];

   /**
   * @constructor constructor
   */
  constructor() {}

  /**
   * Method to update audio src from desired components / services asynchronously
   * @method updateAudioSrc
   * @since Version 1.0.0
   * @param src (string) Src data of audio file
   * @returns Observable<String>
   */
  public updateAudioSrc(src: string) {
    this.audioSrcSubject.next(src);
  }

  /**
   * Method to update audio src from desired components / services asynchronously
   * @method updateVideoSrc
   * @since Version 1.0.0
   * @param src (any) Src data of video file
   * @returns Observable<String>
   */
  public updateVideoSrc(src: string) {
    this.videoSrcSubject.next(src);
  }

  /**
   * Method to update audio src from desired components / services asynchronously
   * @method updateRecordedFile
   * @since Version 1.0.0
   * @param file (any) Blob data of recorded file for audio|video file
   * @returns Observable<Blob>
   */
  public updateRecordedFile(file: File) {
    this.recordedFileSubject.next(file);
  }

  /**
   * @method config
   * @since Version 1.0.0
   * @returns Object<any>
   */
  public get config() {
    return this._config;
  }

  /**
   * Method to set config for initialize media
   * @method setConfig
   * @since 1.0.0
   * @returns Void
   */
  public setConfig(config: any) {
    this._config = config;
  }

  /**
   * Method to get player instance once the player got initialized
   * @method player
   * @since Version 1.0.0
   * @returns Object<any>
   */
  public get player() {
    return this._player;
  }

  /**
   * Method to initialize the player along with desired configuration
   * and required imported plugins.
   * @method initPlayer
   * @since Version 1.0.0
   * @returns Void
   */
  public initPlayer(element, config: any) {
    this.setConfig(config);
    this.setPlugins(config);
    this.plugin = this._plugins;
    this._player = videojs(element, this._config, function() {
      // print version information at startup
      var msg = 'Using video.js ' + videojs.VERSION +
          ' with videojs-record ' + videojs.getPluginVersion('record') +
          ', videojs-wavesurfer ' + videojs.getPluginVersion('wavesurfer') +
          ', wavesurfer.js ' + WaveSurfer.VERSION + ' and recordrtc ' +
          RecordRTC.version;
      videojs.log(msg);
    });
  }

  /**
   * Get method to get the player
   * @method media
   * @since Version 1.0.0
   * @returns Mixed
   */
  public get media(): any {
    if(this._player) return this._player;
    return false;
  }

  /**
   * Method to check dispose / destroy player
   * @method disposePlayer
   */
  public disposePlayer() {
    if (this._player) {
      this._player.dispose();
      this._player = false;
    }
  }

  /**
   * Method to update source of the audio / video file only for videojs options.
   * If videojs is using some external plugin then this method will not work.
   * This method will only work in case of only video js options without any plugins.
   * @method updateMediaSrc
   * @since Version 1.0.0
   * @deprecated In version 1.0.0
   * @returns Void
   */
  public updateMediaSrc(mediaSrc: string): void {
    if(this._player) {
      this._player.src = mediaSrc;
    }
  }

  /**
   * Method to video source once the player is initialized
   * @method loadVideo
   * @since Version 1.0.0
   * @param src Source url of the video file
   * @returns Void
   */
  public loadVideo(src: string): void {
    if(this._player) {
      this._player.load(src);
    }
  }

  /**
   * Method to load src for wavesurfer plugin mainly for audio player 
   * @method updateWavesurferSrc
   * @since Version 1.0.0
   * @param src Audio source
   * @returns Void
   */
  public updateWavesurferSrc(src: string): void {
    if(this._player) {
      this._player.wavesurfer().load(src);
    }
  }

  /**
   * Method to trigger play event for audio / video player
   * @method play
   * @since Version 1.0.0
   * @returns Void
   */
  public play(): void {
    if(this._player) {
      this._player.play();
    }
  }

  /**
   * Method to trigger pause event for audio / video player
   * @method pause
   * @since Version 1.0.0
   * @returns Void
   */
  public pause(): void {
    if(this._player) {
      this._player.pause();
    }
  }

  /**
   * Get method to get all required plugins as an array
   * @method plugins
   * @since Version 1.0.0
   * @returns Array
   */
  public get plugins() {
    return this.plugin;
  }

  /**
   * Method to set required plugins into plugin array
   * @method plugins
   * @since Version 1.0.0
   * @returns Void
   */
  public setPlugins(config: any) {
    if(config.plugins !== undefined && config.plugins.wavesurfer !== undefined) {
      this._plugins.push(Wavesurfer);
    }
    if(config.plugins !== undefined && config.plugins.record !== undefined) {      
      this._plugins.push(Record);
    }
  }

  /**
   * Method to reset a player
   * @method resetPlayer
   * @since Version 1.0.0
   * @returns Void
   */
  public resetPlayer(): void {
    if(this._player) {
      this._player.reset();
    }
  }

  /**
   * Method to destroy wavesurfer
   * @method destroyWavesurfer
   * @since Version 1.0.0
   * @returns Void
   */
  public destroyWavesurfer(): void {
    if(this._player) {
      this._player.wavesurfer().destroy();
    }
  }

  /**
   * Method will be executed when any such device error will occur
   * @method deviceError
   * @since Version 1.0.0
   * @returns Void
   */
  public deviceError() {
    if(!this._player) return;
    this._player.on('deviceError', () => {
      Log.error(this._player.deviceErrorCode, "device errors");
    });
  }

  /**
   * Method will be execute when some error will occur mainly in client side
   * @method error
   * @since Version 1.0.0
   * @returns Void
   */
  public error() {
    if(!this._player) return;
    this._player.on('error', (element, error) => {
      Log.error(error, "errors");
    });
  }

  /**
   * Method to execute when audio | video recording is started
   * @method startRecord
   * @since Version 1.0.0
   * @returns Void
   */
  public startRecord() {
    if(!this._player) return;
    // user clicked the record button and started recording
    this._player.on('startRecord', () => {
        Log.info('started audio recording!');
    });
  }

  /**
   * Method to execute when audio | video recording is finished
   * @method finishRecord
   * @since Version 1.0.0
   * @returns Void
   */
  public finishRecord() {
    if(!this._player) return;
    // user completed recording and stream is available
      this._player.on('finishRecord', () => {
        // the blob object contains the recorded data that
        // can be downloaded by the user, stored on server etc.
        Log.info(this._player.recordedData, "audio recording finished");
        // to save the data
        // this._player.record().saveAs({'audio': 'audio-review.mp3'});
        
        // lets update recorded file using observable
        this.updateRecordedFile(this._player.recordedData);
    });
  }

  /**
   * Method to execute when audio | video recording is finished and it's converted
   * @method finishRecord
   * @since Version 1.0.0
   * @returns Void
   */
  public finishConvert() {
    if(!this._player) return;
    // converter ready and stream is available
    this._player.on('finishConvert', () => {
      // the blob object contains the recorded data that
      // can be downloaded by the user, stored on server etc.
      Log.info(this._player.convertedData, "Finish converted data");
    });
  }

  /**
   * Method to execute when audio | video recorder or player is ready
   * @method readyState
   * @since Version 1.0.0
   * @returns Void
   */
  public readyState() {
    if(!this._player) return;
    this._player.on('ready', () => {
      // do something
    });
  }

  /**
   * Method to catch all media events 
   * ex: startRecord | finishRecord | deviceError | error
   * @method mediaEvents
   * @since Version 1.0.0
   * @returns Void
   */
  public mediaEvents() {
    if(!this._player) return;
    // event callback for device error
    this.deviceError();    
    // error callback
    this.error();
    // event callback for start record
    this.startRecord();
    // event callback for finish record
    this.finishRecord();
  }
}