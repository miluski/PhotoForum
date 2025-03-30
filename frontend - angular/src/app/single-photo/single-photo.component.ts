import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-single-photo',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './single-photo.component.html',
  standalone: true
})
export class SinglePhotoComponent {

}
