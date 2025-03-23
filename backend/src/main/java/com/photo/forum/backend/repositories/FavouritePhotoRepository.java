package com.photo.forum.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.photo.forum.backend.model.entity.FavouritePhoto;
import com.photo.forum.backend.model.entity.Photo;
import com.photo.forum.backend.model.entity.User;

public interface FavouritePhotoRepository extends JpaRepository<FavouritePhoto, Long> {
    Optional<FavouritePhoto> findByUserAndPhoto(User user, Photo photo);

    List<FavouritePhoto> findFavouritePhotosByUser(User user);
}
