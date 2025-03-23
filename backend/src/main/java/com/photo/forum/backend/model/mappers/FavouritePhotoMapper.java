package com.photo.forum.backend.model.mappers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.photo.forum.backend.model.dto.FavouritePhotoDto;
import com.photo.forum.backend.model.dto.PhotoDto;
import com.photo.forum.backend.model.entity.FavouritePhoto;

@Component
public class FavouritePhotoMapper {

    private final PhotoMapper photoMapper;

    @Autowired
    public FavouritePhotoMapper(PhotoMapper photoMapper) {
        this.photoMapper = photoMapper;
    }

    public FavouritePhotoDto getFavouritePhotoDtoFromFavouritePhoto(FavouritePhoto favouritePhoto) {
        PhotoDto photoDto = this.photoMapper.getPhotoDtoFromObject(favouritePhoto.getPhoto());
        return FavouritePhotoDto
                .builder()
                .photoDto(photoDto)
                .build();
    }
}
