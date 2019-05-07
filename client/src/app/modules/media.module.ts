import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
// components for audio / video player / recorder
import { MediaComponent } from '../components/shared/media/media.component';
import { AudioRecorderComponent } from '../components/shared/media/recorders/audio/audio.recorder.component';
import { VideoRecorderComponent } from '../components/shared/media/recorders/video/video.recorder.component';
import { AudioPlayerComponent } from '../components/shared/media/players/audio/audio.player.component';
import { VideoPlayerComponent } from '../components/shared/media/players/video/video.player.component';
// Custom service for media player
import { MediaService } from '../services/media.service';


/**
 * Module class to handle all sort of media related actions like play audio/video in a media player, 
 * record audio/video in a media player.
 * @module MediaModule
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@NgModule({
  declarations: [
    MediaComponent, 
    AudioRecorderComponent,
    AudioPlayerComponent,
    VideoRecorderComponent,
    VideoPlayerComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    MediaComponent
  ],
  providers: [
    MediaService
  ]
})
export class MediaModule {}