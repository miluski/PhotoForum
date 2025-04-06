import { Injectable } from '@angular/core';
import { Photo } from '../interfaces/photo.interface';
import { PhotoDto } from '../interfaces/photodto.interface';
import { PhotoMapper } from '../mappers/PhotoMapper';
import { User } from '../types/user';
import { PhotoService } from './photo.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private isFiltered: boolean;
  private isSearched: boolean;
  private _photoPosts: Photo[];
  private _originalPhotoPosts: Photo[];
  private _selectedFilter: 'all' | 'favourites';

  constructor(
    private photoMapper: PhotoMapper,
    private userService: UserService,
    private photoService: PhotoService
  ) {
    this.isFiltered = false;
    this.isSearched = false;
    this._photoPosts = [];
    this._originalPhotoPosts = [];
    this._selectedFilter = 'all';
  }

  set originalPhotoPosts(originalPhotoPosts: Photo[]) {
    this._originalPhotoPosts = originalPhotoPosts;
  }

  set photoPosts(photoPosts: Photo[]) {
    this._photoPosts = photoPosts;
  }

  get photoPosts(): Photo[] {
    return this._photoPosts;
  }

  get selectedFilter(): string {
    return this._selectedFilter;
  }

  public subscribePhotoPostsArrayChanges(): void {
    this.photoService.photoPosts.subscribe((newPhotoPosts: PhotoDto[]) => {
      const newPhotoArray: Photo[] = newPhotoPosts.map((photoDto: PhotoDto) =>
        this.photoMapper.convertPhotoDtoToPhoto(photoDto)
      );
      this.photoPosts = newPhotoArray;
      this.originalPhotoPosts = newPhotoArray;
    });
  }

  public applyFilter(newFilter: 'all' | 'favourites'): void {
    this._selectedFilter = newFilter;
    if (newFilter === 'all') {
      this.isFiltered = false;
      this.photoPosts = this._originalPhotoPosts;
    } else {
      this.isFiltered = true;
      const favouritePhotoIds: number[] = this.userService.favouritePhotos.map(
        (photo) => photo.id
      );
      this.photoPosts = this._originalPhotoPosts.filter((photo) =>
        favouritePhotoIds.includes(photo.id)
      );
    }
  }

  public handleSearchByNameOrSurname(searchPhrase: string): void {
    const isSearchPhraseCorrect: boolean =
      searchPhrase !== '' &&
      searchPhrase !== ' ' &&
      searchPhrase !== undefined &&
      searchPhrase !== null;
    if (isSearchPhraseCorrect) {
      this.isSearched = true;
      this._photoPosts = this.isFiltered
        ? this._photoPosts
        : this._originalPhotoPosts;
      searchPhrase = searchPhrase.toLowerCase();
      this._photoPosts = this._photoPosts.filter((photo: Photo) => {
        const author: User = photo.author;
        return (
          author.name?.toLowerCase().includes(searchPhrase) ||
          author.surname?.toLowerCase().includes(searchPhrase) ||
          author.login?.toLowerCase().includes(searchPhrase)
        );
      });
    } else {
      this.isSearched = false;
      this._photoPosts = this._originalPhotoPosts;
    }
  }
}
