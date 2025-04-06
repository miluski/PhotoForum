import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FilterService } from '../../services/filter.service';
import { PhotoService } from '../../services/photo.service';
import { UserService } from '../../services/user.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { ImageComponent } from '../image/image.component';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    FooterComponent,
    ImageComponent,
    UserAvatarComponent,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  standalone: true,
})
export class HomeComponent implements OnInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router,
    private photoService: PhotoService,
    protected filterService: FilterService,
    protected userService: UserService,
    protected authService: AuthService
  ) {}

  public ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.authService.handleIsAuthorizedRequest();
      this.authService.isAuthorizedUserObservable.subscribe(
        (isAuthorizedUser: boolean) => {
          if (isAuthorizedUser) {
            this.userService.handleGetUserDetailsRequest();
          }
        }
      );
      this.photoService.initializePhotoPostsArray();
      this.userService.handleGetUserFavouritePhotosRequest();
      this.filterService.subscribePhotoPostsArrayChanges();
    }
  }

  public handleSinglePhotoClick(photoId: number): void {
    this.photoService.currentPhotoId = photoId;
    this.router.navigate(['/single-photo']);
  }
}
