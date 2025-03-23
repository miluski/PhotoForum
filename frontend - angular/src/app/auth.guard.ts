import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, GuardResult, MaybeAsync, Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private httpClient: HttpClient) {}

  public canActivate(): MaybeAsync<GuardResult> {
    return this.httpClient
      .get<HttpResponse<any>>(`${environment.apiUrl}/auth/is-authorized`, {
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<any>) => response.status === 200),
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  private handleError(error: HttpErrorResponse): Observable<boolean> {
    const isStatusUnauthorized: boolean = error.status === 401;
    if (isStatusUnauthorized) {
      window.location.reload();
    } else {
      this.router.navigate(['/unauthorized']);
    }
    return of(false);
  }
}
