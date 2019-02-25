import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { 
    document.body.className = "loginPage";
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    document.body.className="loginPage";
  }

}
