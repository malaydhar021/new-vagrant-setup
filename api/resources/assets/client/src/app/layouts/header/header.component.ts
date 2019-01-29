import { Component, OnInit } from '@angular/core';
import {AuthenticateserviceService} from '../../authenticateservice.service';
import {Router} from '@angular/router';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthenticateserviceService, private router: Router) { }

  errFlg: boolean;
  errString: string;
  signOutResponse: Observable<any>;

  ngOnInit() {
  }

  /**
   * this function log user out from the system
   */
  logout(): void {
    this.signOutResponse = this.authService.doLogout(localStorage.getItem('_tok'));
    this.signOutResponse.subscribe(() => {
        localStorage.removeItem('_cu');
        localStorage.removeItem('_tok');
        this.router.navigate(['/login']);
      }, () => {
        localStorage.removeItem('_cu');
        localStorage.removeItem('_tok');
        this.router.navigate(['/login']);
      }
    );
  }
}
