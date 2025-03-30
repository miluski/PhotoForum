import { Injectable } from '@angular/core';
import { ValidationInterface } from '../interfaces/validation.interface';
import { User } from '../types/user';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root',
})
export class LoginValidationService implements ValidationInterface {
  public user: User;
  public isLoginValid!: boolean;
  public isPasswordValid!: boolean;

  constructor(private validationService: ValidationService) {
    this.user = {
      login: '',
      password: '',
      avatarPath: '',
    };
  }

  public validateUserObject(): boolean {
    this.isLoginValid = this.validationService.isLoginValid(this.user.login);
    this.isPasswordValid = this.validationService.isPasswordValid(
      this.user.password
    );
    return this.isLoginValid && this.isPasswordValid;
  }
}
