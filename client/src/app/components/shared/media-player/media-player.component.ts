import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.scss']
})
export class MediaPlayerComponent implements OnInit {

  // This property is bound using its original name.
  @Input() audioPlayer?: string = '';
  @Input() videoPlayer?: string = '';
  
  constructor() { }

  ngOnInit() {}

}
