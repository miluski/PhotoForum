import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnimationProvider } from '../../providers/animation.provider';
import { AuthService } from '../../services/auth.service';
import { RegisterValidationService } from '../../services/register.validation.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-register',
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  standalone: true,
  animations: [AnimationProvider.animations],
})
export class RegisterComponent {
  protected shakeState: 'start' | 'end';

  constructor(
    protected authService: AuthService,
    protected registerValidationService: RegisterValidationService
  ) {
    this.shakeState = 'start';
  }

  protected handleRegisterButtonClick(): void {
    const isUserObjectValid: boolean =
      this.registerValidationService.validateUserObject();
    if (isUserObjectValid) {
      this.authService.userObject = this.registerValidationService.user;
      this.authService.handleAuthOperationRequest('register');
      return;
    }
    this.shakeState = this.shakeState === 'start' ? 'end' : 'start';
  }
}
