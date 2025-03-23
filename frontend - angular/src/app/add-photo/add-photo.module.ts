import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPhotoComponent } from './add-photo.component';

@NgModule({
  declarations: [AddPhotoComponent],
  imports: [
    CommonModule
  ],
  exports: [AddPhotoComponent]
})
export class AddPhotoModule { }
