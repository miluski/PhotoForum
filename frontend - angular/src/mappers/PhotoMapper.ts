import { Injectable } from '@angular/core';
import { Photo } from '../interfaces/photo.interface';
import { PhotoDto } from '../interfaces/photodto.interface';

@Injectable({
  providedIn: 'root',
})
export class PhotoMapper {
  public convertPhotoDtoToPhoto(photoDto: PhotoDto): Photo {
    return {
      ...photoDto,
      userDto: {
        login: '',
        password: '',
        avatarPath: '',
      },
      commentDtos: [],
      author: photoDto.userDto,
      comments: photoDto.commentDtos,
    };
  }
}
