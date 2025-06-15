import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AnimationProvider } from '../../providers/animation.provider';

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image.component.html',
  animations: [AnimationProvider.animations],
})
export class ImageComponent implements OnInit, OnChanges {
  @Input() imageAlt!: string;
  @Input() imageName!: string;
  @Input() ownClass!: string;
  @Input() dotsClass!: string;
  @Input() imageClass!: string; 
  @Input() renderingMethod: 'client' | 'server';

  protected dotsArray: number[];
  protected isLoading: boolean;
  protected loadingAnimationState: 'start' | 'end';

  private intervalId!: ReturnType<typeof setInterval>;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.dotsArray = [0, 1, 2];
    this.isLoading = true;
    this.loadingAnimationState = 'start';
    this.renderingMethod = 'server';
  }

  public ngOnInit(): void {
    this.loadImage();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageName']) {
      this.loadImage();
    }
  }

  protected get apiUrl(): string {
    if (isPlatformBrowser(this.platformId)) {
      const isServerRendering: boolean = this.renderingMethod === 'server';
      const imageUrl: string = isServerRendering
        ? environment.apiUrl + '/photos/public/' + this.imageName
        : this.imageName;
      return this.imageName !== undefined && this.imageName !== null
        ? imageUrl
        : '';
    }
    return '';
  }

  private loadImage(): void {
    const isBrowser: boolean = isPlatformBrowser(this.platformId);
    if (isBrowser) {
      this.startAnimation();
      const image = document.createElement('img');
      image.src = this.apiUrl;
      image.onload = () => {
        this.isLoading = false;
        clearInterval(this.intervalId);
      };
    }
  }

  private startAnimation(): void {
    this.intervalId = setInterval(() => {
      this.loadingAnimationState =
        this.loadingAnimationState === 'start' ? 'end' : 'start';
    }, 1500);
  }
}
