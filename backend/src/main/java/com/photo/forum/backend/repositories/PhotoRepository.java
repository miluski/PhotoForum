package com.photo.forum.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.photo.forum.backend.model.entity.Photo;

public interface PhotoRepository extends JpaRepository<Photo, Long> {

}
