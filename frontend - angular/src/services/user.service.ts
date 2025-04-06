import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, NEVER, Observable, of } from 'rxjs';
import { environment } from '../environments/environment.development';
import { Photo } from '../interfaces/photo.interface';
import { User } from '../types/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _favouritePhotos: Photo[];
  private _favouritePhotoIdsSubject: BehaviorSubject<number[]>;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {
    this._favouritePhotos = [];
    this._favouritePhotoIdsSubject = new BehaviorSubject<number[]>([]);
  }

  public get favouritePhotos(): Photo[] {
    return this._favouritePhotos;
  }

  public getAuthorNameAndSurname(
    author: User,
    view: 'single' | 'multiple'
  ): string {
    const maxLength: number = view === 'single' ? 25 : 13;
    const authorNameAndSurname: string = author.name + ' ' + author.surname;
    return authorNameAndSurname.length > maxLength
      ? authorNameAndSurname.substring(0, maxLength) + '...'
      : authorNameAndSurname;
  }

  public getIsFavouriteUserPhoto(photoId: number): boolean {
    const favouritePhotosIds: number[] =
      this._favouritePhotoIdsSubject.getValue();
    return (
      favouritePhotosIds.includes(photoId) && this.authService.isAuthorizedUser
    );
  }

  public handleGetUserDetailsRequest(): Observable<never> {
    const request: Observable<HttpResponse<User>> = this.httpClient.get<User>(
      `${environment.apiUrl}/users/user-details`,
      { observe: 'response', responseType: 'json' }
    );
    request.subscribe({
      next: (response: HttpResponse<User>) => {
        this.authService.userObject = response.body as User;
        this.authService.authorizedUserName =
          (response.body as User).name ?? '';
        this.authService.originalUserLogin = response.body?.login ?? '';
      },
      error: () => {
        this.authService.userObject = {
          login: '',
          password: '',
          avatarPath: '',
          name: '',
        };
      },
    });
    return NEVER;
  }

  public handleGetUserFavouritePhotosRequest(): Observable<never> {
    const request: Observable<HttpResponse<Photo[]>> = this.httpClient.get<
      Photo[]
    >(`${environment.apiUrl}/users/get-favourite-photos`, {
      observe: 'response',
      responseType: 'json',
    });
    request.subscribe({
      next: (response: HttpResponse<Photo[]>) => {
        this._favouritePhotos = response.body as Photo[];
        const favouritePhotosIds: number[] = this._favouritePhotos.map(
          (photo: Photo) => photo.id
        );
        this._favouritePhotoIdsSubject.next(favouritePhotosIds);
      },
      error: () => null,
    });
    return NEVER;
  }

  public handleEditUserRequest(): Observable<boolean> {
    const finalUserObject: User = { ...this.authService.userObject };
    if (
      this.authService.userObject.login === this.authService.originalUserLogin
    ) {
      finalUserObject.login = null;
    }
    const request: Observable<HttpResponse<Object>> = this.httpClient.patch(
      `${environment.apiUrl}/users/edit`,
      finalUserObject,
      { observe: 'response' }
    );
    return request.pipe(
      map((httpResponse: HttpResponse<Object>) => httpResponse.status === 200),
      catchError(() => of(false))
    );
  }
}
