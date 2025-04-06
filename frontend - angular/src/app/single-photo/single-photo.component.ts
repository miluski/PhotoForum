import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Photo } from '../../interfaces/photo.interface';
import { AuthService } from '../../services/auth.service';
import { PhotoService } from '../../services/photo.service';
import { UserService } from '../../services/user.service';
import { ValidationService } from '../../services/validation.service';
import { User } from '../../types/user';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { ImageComponent } from '../image/image.component';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';

@Component({
  selector: 'app-single-photo',
  imports: [
    HeaderComponent,
    FooterComponent,
    ImageComponent,
    UserAvatarComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './single-photo.component.html',
  standalone: true,
})
export class SinglePhotoComponent implements OnInit {
  protected newCommentText!: string;
  protected isChangeLikeCountError!: boolean;
  protected isCommentContentInvalid!: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    router: Router,
    private validationService: ValidationService,
    protected photoService: PhotoService,
    protected userService: UserService,
    protected authService: AuthService
  ) {
    if (
      photoService.currentPhotoId === undefined ||
      photoService.currentPhotoId === null
    ) {
      router.navigate(['/']);
    }
  }

  public ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getPhotoObject();
    }
  }

  public handlePhotoLikeClick(photoId: number): void {
    if (this.authService.isAuthorizedUser) {
      const isPhotoLiked: boolean =
        this.userService.getIsFavouriteUserPhoto(photoId);
      const operation: 'add-to' | 'remove-from' = isPhotoLiked
        ? 'remove-from'
        : 'add-to';
      this.handleChangeLikesCountRequest(photoId, operation);
    }
  }

  public handleAddComentClick(photoId: number): void {
    this.isCommentContentInvalid =
      !this.validationService.isCommentContentValid(this.newCommentText);
    if (this.isCommentContentInvalid === false) {
      const isAddedObservable: Observable<boolean> =
        this.photoService.handleAddCommentToPhoto(this.newCommentText, photoId);
      isAddedObservable.subscribe((isAdded: boolean) => {
        if (isAdded) {
          this.getPhotoObject();
          this.userService.handleGetUserFavouritePhotosRequest();
        } else {
          this.isCommentContentInvalid = true;
        }
      });
    }
  }

  protected get photoObject(): Photo {
    const initPhotoObject: Photo = {
      id: -1,
      author: this.initUserObject,
      path: '',
      likesCount: 0,
      comments: [],
      userDto: this.initUserObject,
      commentDtos: [],
    };
    return this.photoService.photoPost !== null
      ? this.photoService.photoPost
      : initPhotoObject;
  }

  private handleChangeLikesCountRequest(
    photoId: number,
    operation: 'add-to' | 'remove-from'
  ): void {
    const isStatusChanged: Observable<boolean> =
      this.photoService.handleChangePhotoLikesCount(photoId, operation);
    isStatusChanged.subscribe((isStatusChanged: boolean) => {
      if (isStatusChanged) {
        this.getPhotoObject();
        this.userService.handleGetUserFavouritePhotosRequest();
      } else {
        this.isChangeLikeCountError = true;
        setTimeout(() => (this.isChangeLikeCountError = false), 1000);
      }
    });
  }

  private getPhotoObject(): void {
    this.photoService.handleGetSinglePhoto();
  }

  private get initUserObject(): User {
    return {
      name: '',
      surname: '',
      login: '',
      avatarPath: '',
      password: '',
    };
  }
}
