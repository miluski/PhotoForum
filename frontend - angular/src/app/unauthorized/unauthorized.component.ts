import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  imports: [HeaderComponent, FooterComponent],
  standalone: true
})
export class UnauthorizedComponent {

}
