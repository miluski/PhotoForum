import { Injectable } from '@angular/core';
import { ValidationInterface } from '../interfaces/validation.interface';
import { User } from '../types/user';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root',
})
export class RegisterValidationService implements ValidationInterface {
  public user: User;
  public isNameValid!: boolean;
  public isLoginValid!: boolean;
  public isSurnameValid!: boolean;
  public isPasswordValid!: boolean;

  constructor(private validationService: ValidationService) {
    this.user = {
      name: '',
      surname: '',
      login: '',
      password: '',
      avatarPath: '',
    };
  }

  public validateUserObject(): boolean {
    this.isNameValid = this.validationService.isNameValid(this.user.name);
    this.isSurnameValid = this.validationService.isSurnameValid(
      this.user.surname
    );
    this.isLoginValid = this.validationService.isLoginValid(this.user.login ?? "");
    this.isPasswordValid = this.validationService.isPasswordValid(
      this.user.password
    );
    return (
      this.isNameValid &&
      this.isSurnameValid &&
      this.isLoginValid &&
      this.isPasswordValid
    );
  }
}
