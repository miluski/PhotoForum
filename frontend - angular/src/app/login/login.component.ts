import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnimationProvider } from '../../providers/animation.provider';
import { AuthService } from '../../services/auth.service';
import { LoginValidationService } from '../../services/login.validation.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-login',
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  standalone: true,
  animations: [AnimationProvider.animations],
})
export class LoginComponent {
  protected shakeState: 'start' | 'end';

  constructor(
    protected authService: AuthService,
    protected loginValidationService: LoginValidationService
  ) {
    this.shakeState = 'start';
  }

  protected handleLoginButtonClick(): void {
    const isUserObjectValid: boolean =
      this.loginValidationService.validateUserObject();
    if (isUserObjectValid) {
      this.authService.userObject = this.loginValidationService.user;
      this.authService.handleAuthOperationRequest('login');
      return;
    }
    this.shakeState = this.shakeState === 'start' ? 'end' : 'start';
  }
}
