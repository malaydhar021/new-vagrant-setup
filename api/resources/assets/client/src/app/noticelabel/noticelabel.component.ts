import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-noticelabel',
  templateUrl: './noticelabel.component.html',
  styleUrls: ['./noticelabel.component.css']
})
export class NoticelabelComponent implements OnInit {
  @Input() showNotice: boolean;
  constructor() { }
  ngOnInit() {
  }

}
