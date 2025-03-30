import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header-popup',
  imports: [CommonModule, RouterModule],
  templateUrl: './header-popup.component.html',
  standalone: true,
})
export class HeaderPopupComponent {
  @Input() isOpened!: boolean;
  @Output() isOpenedChanged!: EventEmitter<boolean>;

  constructor(private router: Router, protected authService: AuthService) {
    this.isOpenedChanged = new EventEmitter<boolean>();
  }

  public getCanRender(option: string): boolean {
    const isNotLoggedUserAtBaseUrl: boolean =
      this.isBaseUrl && this.isNotAuthorizedUser;
    switch (option) {
      case 'login-redirect':
        return this.isRegisterUrl || isNotLoggedUserAtBaseUrl;
      case 'register-redirect':
        return this.isLoginUrl || isNotLoggedUserAtBaseUrl;
      case 'dashboard-redirect':
        return this.isBaseUrl && this.isAuthorizedUser && this.isNotOnDashboard;
      case 'logout-option':
        return this.isBaseUrl && this.isAuthorizedUser;
    }
    return false;
  }

  public handleLogoutRequest(): void {
    this.isOpened = false;
    this.isOpenedChanged.emit(this.isOpened);
    this.authService.handleLogoutRequest();
    this.router.navigate(['/']);
  }

  private get isAuthorizedUser(): boolean {
    return this.authService.isAuthorizedUser;
  }

  private get isNotAuthorizedUser(): boolean {
    return this.authService.isAuthorizedUser === false;
  }

  private get isBaseUrl(): boolean {
    const isHomeUrl: boolean = this.router.url === '/';
    const isNotAtAuthSite: boolean =
      this.isLoginUrl === false && this.isRegisterUrl === false;
    return isHomeUrl || isNotAtAuthSite;
  }

  private get isLoginUrl(): boolean {
    return this.router.url === '/login';
  }

  private get isRegisterUrl(): boolean {
    return this.router.url === '/register';
  }

  private get isNotOnDashboard(): boolean {
    return this.router.url !== '/dashboard';
  }
}
