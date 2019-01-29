import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthenticateserviceService} from '../authenticateservice.service';
import {Router} from '@angular/router';

@Injectable()
export class AuthGuardGuard implements CanActivate {
  constructor(private authService: AuthenticateserviceService, private router: Router) {}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.checkLogin()) {
      return true;
    } else {
      this.router.navigate(['login']);
    }
  }
}
