import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-unauthorized',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './unauthorized.component.html',
  standalone: true,
})
export class UnauthorizedComponent {}
