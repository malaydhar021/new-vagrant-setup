import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
// for audio/video player
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
import { MediaPlayerComponent } from '../components/shared/media-player/media-player.component';
import { VideoPlayerComponent } from '../components/shared/media-player/video-player/video-player.component';
import { AudioPlayerComponent } from '../components/shared/media-player/audio-player/audio-player.component';
import { MediaPlayerService } from '../services/media-player.service';

@NgModule({
  declarations: [
    MediaPlayerComponent, 
    VideoPlayerComponent,
    AudioPlayerComponent
  ],
  imports: [
    CommonModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
  ],
  exports: [
    MediaPlayerComponent
  ],
  providers: [
    MediaPlayerService
  ]
})
export class MediaPlayerModule {}