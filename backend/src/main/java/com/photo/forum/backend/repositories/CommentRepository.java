package com.photo.forum.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.photo.forum.backend.model.entity.Comment;
import com.photo.forum.backend.model.entity.Photo;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPhoto(Photo photo);
}
