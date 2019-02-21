import { Component, OnInit, ElementRef, ViewChild, HostListener, } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  constructor() { 
    document.body.className = "sign-upPage";
   }

  ngOnInit() {
  }

  ngOnDestroy(){
    document.body.className="sign-upPage";
  }

  public secondStepeFlag: boolean = false;
  cradnumber: number;

  nextStep(){
    this.secondStepeFlag = true;
  }
  goBack(){
    this.secondStepeFlag = false;
  }
  
}
