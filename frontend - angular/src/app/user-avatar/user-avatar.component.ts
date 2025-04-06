import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';
import { environment } from '../../environments/environment.development';
import { User } from '../../types/user';

@Component({
  selector: 'app-user-avatar',
  imports: [CommonModule],
  templateUrl: './user-avatar.component.html',
  standalone: true,
})
export class UserAvatarComponent {
  @Input() userObject!: User;
  @Input() ownClass!: string;
  @Input() avatarAlt!: string;
  @Input() avatarPath!: string;
  @Input() avatarClass!: string;

  protected isLoading: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isLoading = true;
  }

  public ngOnInit(): void {
    this.loadAvatar();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageName']) {
      this.isLoading = true;
      this.loadAvatar();
    }
  }

  protected get apiUrl(): string {
    this.avatarPath = this.avatarPath && this.avatarPath.replace('/media/', '');
    return this.avatarPath !== undefined
      ? environment.apiUrl + '/photos/public/' + this.avatarPath
      : '';
  }

  protected get userInitials(): string {
    const isUserObjectNotUndefined: boolean = this.userObject !== undefined;
    if (isUserObjectNotUndefined) {
      const nameInitial: string = this.userObject.name?.substring(0, 1) ?? 'N';
      const surnameInitial: string =
        this.userObject.surname?.substring(0, 1) ?? 'N';
      return nameInitial + ' ' + surnameInitial;
    }
    return 'NN';
  }

  private loadAvatar(): void {
    const isBrowser: boolean = isPlatformBrowser(this.platformId);
    if (isBrowser) {
      const image = document.createElement('img');
      image.src = this.apiUrl;
      image.onload = () => (this.isLoading = false);
    }
  }
}
