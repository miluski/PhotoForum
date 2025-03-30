import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  public isNameValid(name: string | undefined): boolean {
    return name !== undefined && name.length >= 3 && name.length <= 50;
  }

  public isSurnameValid(surname: string | undefined): boolean {
    return surname !== undefined && surname.length >= 5 && surname.length <= 60;
  }

  public isLoginValid(login: string | undefined): boolean {
    return login !== undefined && login.length >= 5 && login.length <= 20;
  }

  public isPasswordValid(password: string | undefined): boolean {
    const passwordPattern =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return password !== undefined && passwordPattern.test(password);
  }

  public isCommentContentValid(commentContent: string | undefined): boolean {
    return (
      commentContent !== undefined &&
      commentContent.length >= 10 &&
      commentContent.length <= 100
    );
  }
}
