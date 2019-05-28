import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-widget-styles',
  templateUrl: './widget-styles.component.html',
  styleUrls: ['./widget-styles.component.scss']
})
export class WidgetStylesComponent implements OnInit {
  // 100 => Rounded | 101 => Squared | 102 => Tear Drop | 103 => Squared Elevated | 104 => Tear Drop Elevated
  @Input() styleType?: number = 100; // default style is set to Rounded
  // textual | audio | video
  @Input() reviewType?: string = 'textual'; // default review type is set to textual
  constructor() { }

  ngOnInit() {}

}
