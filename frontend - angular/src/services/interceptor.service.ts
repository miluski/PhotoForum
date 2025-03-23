import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  filter,
  NEVER,
  Observable,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  private next!: HttpHandler;
  private isRefreshing: boolean;
  private request!: HttpRequest<any>;
  private refreshTokenSubject: BehaviorSubject<boolean | null>;

  constructor(private router: Router, private httpClient: HttpClient) {
    this.isRefreshing = false;
    this.refreshTokenSubject = new BehaviorSubject<boolean | null>(null);
  }

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const clonedRequest: HttpRequest<any> = request.clone({
      withCredentials: true,
    });
    this.next = next;
    this.request = request;
    return next.handle(clonedRequest).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    const isStatusUnauthorized: boolean = error.status === 401;
    if (isStatusUnauthorized) {
      return this.handleUnauthorizedError();
    } else {
      this.router.navigate(['/unauthorized']);
    }
    return NEVER;
  }

  private handleUnauthorizedError(): Observable<HttpEvent<any>> {
    return this.isRefreshing
      ? this.handleRefreshingError()
      : this.handleNotRefresingError();
  }

  private handleNotRefresingError(): Observable<HttpEvent<any>> {
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);
    return this.httpClient
      .post(
        `${environment.apiUrl}/auth/refresh-tokens`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap(() => this.handleStopRefreshing()),
        switchMap(() => this.next.handle(this.request)),
        catchError((error: HttpErrorResponse) =>
          this.handleAuthTokenRefreshingError(error)
        )
      );
  }

  private handleRefreshingError(): Observable<HttpEvent<any>> {
    return this.refreshTokenSubject.pipe(
      filter((isAuthorized: boolean | null) => isAuthorized !== null),
      take(1),
      switchMap(() => this.next.handle(this.request)),
      catchError((error: HttpErrorResponse) =>
        this.handleAuthTokenRefreshingError(error)
      )
    );
  }

  private handleAuthTokenRefreshingError(
    error: HttpErrorResponse
  ): Observable<never> {
    this.isRefreshing = false;
    const isProtectedEndpoint: boolean =
      this.router.url === '/dashboard' || this.router.url === '/add-photo';
    const isUserNotAllowed: boolean =
      error.status === 403 || (error.status === 500 && isProtectedEndpoint);
    isUserNotAllowed ? this.router.navigate(['/unauthorized']) : null;
    return throwError(() => error);
  }

  private handleStopRefreshing(): void {
    this.isRefreshing = false;
    this.refreshTokenSubject.next(true);
  }
}
