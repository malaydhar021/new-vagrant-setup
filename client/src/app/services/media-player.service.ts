import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import { Log } from '../helpers/app.helper';

/**
 * Service to update the src of audio / video file to play it into audio / video player
 * @class MediaPlayerService
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Injectable()
export class MediaPlayerService {
  // declaring variant of Subject audio src
  private audioSrcSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  audioSrc$: Observable<string> = this.audioSrcSubject.asObservable();

  // declaring variant of Subject video src
  private videoSrcSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  videoSrc$: Observable<any> = this.videoSrcSubject.asObservable();

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
}