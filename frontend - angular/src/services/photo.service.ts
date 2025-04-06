import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, NEVER, Observable, of } from 'rxjs';
import { environment } from '../environments/environment.development';
import { Photo } from '../interfaces/photo.interface';
import { PhotoDto } from '../interfaces/photodto.interface';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private _currentPhotoId!: number;
  private _photoPosts: Observable<PhotoDto[]>;
  private photoPostsSubject: BehaviorSubject<PhotoDto[]>;
  private photoPostSubject: BehaviorSubject<Photo | null>;

  constructor(private httpClient: HttpClient) {
    this.photoPostsSubject = new BehaviorSubject<PhotoDto[]>([]);
    this.photoPostSubject = new BehaviorSubject<Photo | null>(null);
    this._photoPosts = this.photoPostsSubject.asObservable();
  }

  public get photoPosts(): Observable<PhotoDto[]> {
    return this._photoPosts;
  }

  public get photoPost(): Photo | null {
    return this.photoPostSubject.getValue();
  }

  public get currentPhotoId(): number {
    return this._currentPhotoId;
  }

  public set currentPhotoId(currentPhotoId: number) {
    this._currentPhotoId = currentPhotoId;
  }

  public initializePhotoPostsArray(): Observable<never> {
    const request: Observable<HttpResponse<PhotoDto[]>> = this.httpClient.get<
      PhotoDto[]
    >(`${environment.apiUrl}/photos/posts`, {
      observe: 'response',
      responseType: 'json',
    });
    request.subscribe({
      next: (response: HttpResponse<PhotoDto[]>) => {
        const photoArray: PhotoDto[] = response.body || [];
        this.photoPostsSubject.next(photoArray);
      },
      error: (error: HttpErrorResponse) =>
        console.error('Retrieving photos array error code: ' + error.status),
    });
    return NEVER;
  }

  public handleUploadPhoto(photoPath: string): Observable<boolean> {
    const request: Observable<HttpResponse<Object>> = this.httpClient.post(
      `${environment.apiUrl}/photos/new`,
      { path: photoPath },
      { observe: 'response' }
    );
    return request.pipe(
      map((response: HttpResponse<Object>) => response.status === 200),
      catchError(() => of(false))
    );
  }

  public handleGetSinglePhoto(): Observable<never> {
    const request: Observable<HttpResponse<Object>> = this.httpClient.get(
      `${environment.apiUrl}/photos/public/id/${this._currentPhotoId}`,
      { observe: 'response', responseType: 'json' }
    );
    request.subscribe({
      next: (httpResponse: HttpResponse<Object>) => {
        const photoPost: Photo = httpResponse.body as Photo;
        photoPost.author = photoPost.userDto;
        photoPost.comments = photoPost.commentDtos;
        this.photoPostSubject.next(photoPost);
      },
      error: (error: HttpErrorResponse) =>
        console.error('Retrieving single photo error code: ' + error.status),
    });
    return NEVER;
  }

  public handleChangePhotoLikesCount(
    photoId: number,
    operation: 'add-to' | 'remove-from'
  ): Observable<boolean> {
    const endpoint: string = `${environment.apiUrl}/photos/${photoId}/${operation}-favourites`;
    const request: Observable<HttpResponse<Object>> =
      operation === 'remove-from'
        ? this.httpClient.delete(endpoint, { observe: 'response' })
        : this.httpClient.post(endpoint, {}, { observe: 'response' });
    return request.pipe(
      map((httpResponse: HttpResponse<Object>) => httpResponse.status === 200),
      catchError(() => of(false))
    );
  }

  public handleAddCommentToPhoto(
    comment: string,
    photoId: number
  ): Observable<boolean> {
    const request: Observable<HttpResponse<Object>> = this.httpClient.post(
      `${environment.apiUrl}/photos/${photoId}/add-comment`,
      comment,
      { observe: 'response' }
    );
    return request.pipe(
      map((httpResponse: HttpResponse<Object>) => httpResponse.status === 200),
      catchError(() => of(false))
    );
  }
}
