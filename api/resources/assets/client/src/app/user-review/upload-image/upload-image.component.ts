import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit {
  @Input() reviewLinkData: any;
  @Input() imageBaseURL: string;
  @Output() upldImgAns: EventEmitter<any> = new EventEmitter();
  constructor() { }
  reviewImage: File;
  ngOnInit() {
  }
  /**
   * this function handle image upload on change event on input type file in view
   * @param event
   */
  handleImageUpload(event) {
    this.reviewImage = event;
  }

  /**
   * this function throws back the file if selected yes else sends back null
   * @param {boolean} answer
   */
  goNext(answer: boolean) {
    if (answer) {
      this.upldImgAns.emit(this.reviewImage);
    } else {
      this.upldImgAns.emit('');
    }
  }
}
