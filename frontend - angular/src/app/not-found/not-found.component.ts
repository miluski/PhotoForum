import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-not-found',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './not-found.component.html',
  standalone: true,
})
export class NotFoundComponent {}
