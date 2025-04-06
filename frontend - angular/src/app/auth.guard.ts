import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private httpClient: HttpClient) {}

  public canActivate(): Observable<boolean> {
    return this.httpClient
      .get(`${environment.apiUrl}/auth/is-authorized`, {
        observe: 'response',
        withCredentials: true,
      })
      .pipe(
        map((response: HttpResponse<Object>) => response.status === 200),
        catchError(() => this.handleError())
      );
  }

  private handleError(): Observable<boolean> {
    this.router.navigate(['/unauthorized']);
    return of(false);
  }
}
