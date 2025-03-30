import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NEVER, Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _userObject!: User;
  private _isAuthorizedUser: boolean;
  private _authorizedUserName!: string;
  private _isOperationSuccessfull!: boolean;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
  ) {
    this._isAuthorizedUser = false;
  }

  get isAuthorizedUser(): boolean {
    return this._isAuthorizedUser;
  }

  get authorizedUserName(): string {
    return this._authorizedUserName;
  }

  get isOperationSuccessfull(): boolean {
    return this._isOperationSuccessfull;
  }

  set userObject(userObject: User) {
    this._userObject = userObject;
  }

  set isAuthorizedUser(isAuthorizedUser: boolean) {
    this._isAuthorizedUser = isAuthorizedUser;
  }

  public handleAuthOperationRequest(
    operation: 'login' | 'register'
  ): Observable<never> {
    const request: Observable<HttpResponse<string>> = this.httpClient.post(
      `${environment.apiUrl}/auth/${operation}`,
      { ...this._userObject },
      { observe: 'response', responseType: 'text' }
    );
    request.subscribe({
      next: (response: HttpResponse<string>) => {
        this.handleOperationStatus(operation);
        this._authorizedUserName = response.body as string;
        this._isOperationSuccessfull = response.status === 200;
      },
      error: () => (this._isOperationSuccessfull = false),
    });
    return NEVER;
  }

  public handleLogoutRequest(): Observable<never> {
    const request: Observable<Object> = this.httpClient.post(
      `${environment.apiUrl}/auth/logout`,
      {}
    );
    request.subscribe();
    this.isAuthorizedUser = false;
    return NEVER;
  }

  public handleIsAuthorized(): Observable<never> {
    const request: Observable<HttpResponse<Object>> = this.httpClient.get(
      `${environment.apiUrl}/auth/is-authorized`,
      { observe: 'response' }
    );
    request.subscribe({
      next: (response: HttpResponse<Object>) => {
        if (response.status === 200) {
          this._isAuthorizedUser = true;
        }
      },
    });
    return NEVER;
  }

  private handleOperationStatus(operation: 'login' | 'register'): void {
    const isOperationLogin: boolean = operation === 'login';
    this.isAuthorizedUser = isOperationLogin;
    const redirectPath: string = isOperationLogin ? '/' : '/login';
    this.router.navigate([redirectPath]);
  }
}
