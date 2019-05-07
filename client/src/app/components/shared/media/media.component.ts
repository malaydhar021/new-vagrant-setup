import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Log } from 'src/app/helpers/app.helper';

/**
 * Class component to handle all sort of options for audio / video records
 * @class MediaComponent
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit, OnDestroy {
  @Input() recorder?: string = null; // audio || video
  @Input() player?: string = null; // audio || video
  @Input() src?: string = null; // audio src | video src

  /**
   * @method ngOnInit
   * @returns Void
   */
  public ngOnInit() {}

  /**
   * @method ngAfterViewInit
   * @returns Void
   */
  public ngAfterViewInit() {
    Log.info(this.recorder, "Logging input @recorder in media component");
    Log.info(this.player, "Logging input @player in media component");
    Log.info(this.src, "Logging input @src in media component");
  }

  /**
   * @method ngOnDestroy
   * @returns Void
   */
  public ngOnDestroy() {}
}