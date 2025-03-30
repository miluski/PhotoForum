import { Injectable } from '@angular/core';
import { CanActivate, GuardResult, MaybeAsync, Router } from '@angular/router';
import { NEVER } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorizedGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  public canActivate(): MaybeAsync<GuardResult> {
    const currentUrl: string = this.router.url;
    const isAtLogin: boolean = currentUrl === '/login';
    const isAtRegister: boolean = currentUrl === '/register';
    if ((isAtLogin || isAtRegister) && this.authService.isAuthorizedUser) {
      this.router.navigate(['/']);
      return NEVER;
    }
    return true;
  }
}
