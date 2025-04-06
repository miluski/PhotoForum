import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PhotoService } from '../../services/photo.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { ImageComponent } from '../image/image.component';

@Component({
  selector: 'app-add-photo',
  imports: [HeaderComponent, FooterComponent, ImageComponent, CommonModule],
  templateUrl: './add-photo.component.html',
  standalone: true,
})
export class AddPhotoComponent {
  private selectedPhoto!: File;
  protected isUploading: boolean;
  protected previewUrl: string | null;
  protected isUploaded: boolean | null;

  constructor(private router: Router, private photoService: PhotoService) {
    this.isUploading = false;
    this.previewUrl = null;
    this.isUploaded = null;
  }

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.selectedPhoto = event.dataTransfer.files[0];
      this.convertToBase64();
    }
  }

  public onFileSelected(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedPhoto = input.files[0];
      this.convertToBase64();
    }
  }

  private convertToBase64(): void {
    if (!this.selectedPhoto) {
      return;
    }
    const reader: FileReader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
      this.handleUploadPhoto();
    };
    reader.readAsDataURL(this.selectedPhoto);
  }

  private handleUploadPhoto(): void {
    if (this.previewUrl !== null) {
      this.isUploading = true;
      const isUploadedObservable: Observable<boolean> =
        this.photoService.handleUploadPhoto(this.previewUrl);
      isUploadedObservable.subscribe((isUploaded: boolean) => {
        this.isUploading = false;
        this.isUploaded = isUploaded;
        if (this.isUploaded) {
          setTimeout(() => this.router.navigate(['/']), 500);
        }
      });
    }
  }
}
