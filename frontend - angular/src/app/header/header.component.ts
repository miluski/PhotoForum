import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HeaderPopupComponent } from '../header-popup/header-popup.component';

@Component({
  selector: 'app-header',
  imports: [HeaderPopupComponent, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  standalone: true,
})
export class HeaderComponent {
  protected isPopupOpened: boolean;

  constructor(private router: Router, protected authService: AuthService) {
    this.isPopupOpened = false;
  }

  get isAtHomeUrl(): boolean {
    return this.router.url === '/';
  }
}
