import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  constructor(private httpClient: HttpClient) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const clonedRequest: HttpRequest<any> = request.clone({
      withCredentials: true,
    });
    const subject: Subject<HttpEvent<any>> = new Subject<HttpEvent<any>>();
    next.handle(clonedRequest).subscribe({
      next: (event: HttpEvent<any>) => subject.next(event),
      error: (error: HttpErrorResponse) => {
        error.status === 401
          ? this.attemptRefreshToken(subject, request, next)
          : subject.error(error);
      },
      complete: () => subject.complete(),
    });
    return subject.asObservable();
  }

  private attemptRefreshToken(
    subject: Subject<HttpEvent<any>>,
    originalRequest: HttpRequest<any>,
    next: HttpHandler
  ): void {
    this.httpClient
      .post(
        `${environment.apiUrl}/auth/refresh-tokens`,
        {},
        { withCredentials: true }
      )
      .subscribe({
        next: () => {
          const newRequest: HttpRequest<any> = originalRequest.clone({
            withCredentials: true,
          });
          next.handle(newRequest).subscribe({
            next: (event) => subject.next(event),
            error: (retryError) => subject.error(retryError),
            complete: () => subject.complete(),
          });
        },
        error: (refreshError) => subject.error(refreshError),
      });
  }
}
