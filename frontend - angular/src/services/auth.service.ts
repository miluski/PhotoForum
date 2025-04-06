import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, NEVER, Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _userObject!: User;
  private _originalUserLogin!: string;
  private _isAuthorizedUserObservable: Observable<boolean>;
  private _isAuthorizedUserSubject: BehaviorSubject<boolean>;
  private _authorizedUserName!: string;
  private _isOperationSuccessfull!: boolean;

  constructor(private router: Router, private httpClient: HttpClient) {
    this._isAuthorizedUserSubject = new BehaviorSubject(false);
    this._isAuthorizedUserObservable =
      this._isAuthorizedUserSubject.asObservable();
  }

  get isAuthorizedUser(): boolean {
    return this._isAuthorizedUserSubject.getValue();
  }

  get isAuthorizedUserObservable(): Observable<boolean> {
    return this._isAuthorizedUserObservable;
  }

  get authorizedUserName(): string {
    return this._authorizedUserName;
  }

  get isOperationSuccessfull(): boolean {
    return this._isOperationSuccessfull;
  }

  get userObject(): User {
    return this._userObject;
  }

  get originalUserLogin(): string {
    return this._originalUserLogin;
  }

  set authorizedUserName(authorizedUserName: string) {
    this._authorizedUserName = authorizedUserName;
  }

  set userObject(userObject: User) {
    this._userObject = userObject;
  }

  set originalUserLogin(userLogin: string) {
    this._originalUserLogin = userLogin;
  }

  public handleIsAuthorizedRequest(): Observable<never> {
    const request: Observable<HttpResponse<Object>> = this.httpClient.get(
      `${environment.apiUrl}/auth/is-authorized`,
      { observe: 'response' }
    );
    request.subscribe({
      next: (response: HttpResponse<Object>) =>
        this._isAuthorizedUserSubject.next(response.status === 200),
      error: () => this._isAuthorizedUserSubject.next(false),
    });
    return NEVER;
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
    this._isAuthorizedUserSubject.next(false);
    return NEVER;
  }

  private handleOperationStatus(operation: 'login' | 'register'): void {
    const isOperationLogin: boolean = operation === 'login';
    this._isAuthorizedUserSubject.next(isOperationLogin);
    const redirectPath: string = isOperationLogin ? '/' : '/login';
    this.router.navigate([redirectPath]);
  }
}
