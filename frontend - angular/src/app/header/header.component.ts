import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FilterService } from '../../services/filter.service';
import { HeaderPopupComponent } from '../header-popup/header-popup.component';

@Component({
  selector: 'app-header',
  imports: [HeaderPopupComponent, CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  standalone: true,
})
export class HeaderComponent {
  protected searchPhrase!: string;
  protected isPopupOpened: boolean;

  constructor(
    private router: Router,
    private filterService: FilterService,
    protected authService: AuthService
  ) {
    this.isPopupOpened = false;
  }

  get isAtHomeUrl(): boolean {
    return this.router.url === '/';
  }

  public handleSearch(): void {
    this.filterService.handleSearchByNameOrSurname(this.searchPhrase);
  }
}
