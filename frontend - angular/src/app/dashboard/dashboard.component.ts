import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnimationProvider } from '../../providers/animation.provider';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ValidationService } from '../../services/validation.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { ImageComponent } from '../image/image.component';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    HeaderComponent,
    FooterComponent,
    ImageComponent,
    UserAvatarComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './dashboard.component.html',
  standalone: true,
  animations: [AnimationProvider.animations],
})
export class DashboardComponent {
  private selectedPhoto!: File;

  protected isNameValid!: boolean;
  protected isSurnameValid!: boolean;
  protected isLoginValid!: boolean;
  protected isPasswordValid!: boolean;
  protected shakeState: 'start' | 'end';
  protected isEditSuccessfull!: boolean;

  constructor(
    private userService: UserService,
    private validationService: ValidationService,
    protected authService: AuthService
  ) {
    this.shakeState = 'start';
  }

  public onFileSelected(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedPhoto = input.files[0];
      this.convertToBase64();
    }
  }

  protected handleSaveChangesButtonClick(): void {
    const isUserObjectValid: boolean = this.validateEditedUserObject();
    if (isUserObjectValid == true) {
      this.userService
        .handleEditUserRequest()
        .subscribe((isEditSuccessfull: boolean) => {
          this.isEditSuccessfull = isEditSuccessfull;
          this.userService.handleGetUserDetailsRequest();
        });
      return;
    }
    this.shakeState = this.shakeState === 'start' ? 'end' : 'start';
  }

  private convertToBase64(): void {
    if (!this.selectedPhoto) {
      return;
    }
    const reader: FileReader = new FileReader();
    reader.onload = () => {
      this.authService.userObject.avatarPath = reader.result as string;
    };
    reader.readAsDataURL(this.selectedPhoto);
  }

  private validateEditedUserObject(): boolean {
    this.isNameValid = this.validateName();
    this.isSurnameValid = this.validateSurname();
    this.isLoginValid = this.validateLogin();
    this.isPasswordValid = this.validatePassword();
    return (
      this.isNameValid ||
      this.isSurnameValid ||
      this.isLoginValid ||
      this.isPasswordValid ||
      this.validateAvatarPath()
    );
  }

  private validateName(): boolean {
    const name: string | undefined = this.authService.userObject.name;
    if (name !== undefined) {
      return this.validationService.isNameValid(name);
    }
    return true;
  }

  private validateSurname(): boolean {
    const surname: string | undefined = this.authService.userObject.surname;
    if (surname !== undefined) {
      return this.validationService.isSurnameValid(surname);
    }
    return true;
  }

  private validateLogin(): boolean {
    const login: string | null = this.authService.userObject.login;
    if (login !== null) {
      return this.validationService.isLoginValid(login);
    }
    return true;
  }

  private validatePassword(): boolean {
    const password: string | undefined = this.authService.userObject.password;
    if (password) {
      return this.validationService.isPasswordValid(password);
    }
    return true;
  }

  private validateAvatarPath(): boolean {
    const avatarPath: string | undefined =
      this.authService.userObject.avatarPath;
    if (avatarPath && avatarPath != '') {
      return avatarPath.length > 1;
    }
    return true;
  }
}
