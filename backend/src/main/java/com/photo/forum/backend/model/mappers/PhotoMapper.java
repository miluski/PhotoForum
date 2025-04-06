package com.photo.forum.backend.model.mappers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.photo.forum.backend.model.dto.CommentDto;
import com.photo.forum.backend.model.dto.PhotoDto;
import com.photo.forum.backend.model.dto.UserDto;
import com.photo.forum.backend.model.entity.Comment;
import com.photo.forum.backend.model.entity.FavouritePhoto;
import com.photo.forum.backend.model.entity.Photo;
import com.photo.forum.backend.model.entity.User;
import com.photo.forum.backend.repositories.CommentRepository;

@Component
public class PhotoMapper {

    private final UserMapper userMapper;
    private final CommentMapper commentMapper;
    private final CommentRepository commentRepository;

    @Autowired
    public PhotoMapper(UserMapper userMapper, CommentMapper commentMapper, CommentRepository commentRepository) {
        this.userMapper = userMapper;
        this.commentMapper = commentMapper;
        this.commentRepository = commentRepository;
    }

    public Photo getPhotoFromDto(PhotoDto photoDto) {
        User user = this.userMapper.getUserFromDto(photoDto.getUserDto());
        return this.getPhotoFromDto(photoDto, user, photoDto.getPath());
    }

    public Photo getPhotoFromDto(PhotoDto photoDto, User user, String photoPath) {
        String finalPhotoPath = photoPath.replace("/media/", "");
        return Photo
                .builder()
                .likesCount(0)
                .path(finalPhotoPath)
                .user(user)
                .build();
    }

    public PhotoDto getPhotoDtoFromFavouritePhoto(FavouritePhoto favouritePhoto) {
        Photo photo = favouritePhoto.getPhoto();
        return this.getPhotoDtoFromObject(photo);
    }

    public PhotoDto getPhotoDtoFromObject(Photo photo) {
        String finalPhotoPath = photo.getPath().replace("/media/", "");
        UserDto userDto = this.userMapper.getUserDtoWithoutCriticalData(photo.getUser());
        List<Comment> comments = this.commentRepository.findByPhoto(photo);
        List<CommentDto> commentDtos = comments
                .stream()
                .sorted((comment1, comment2) -> Long.compare(comment2.getAddDate().getTime(),
                        comment1.getAddDate().getTime()))
                .map(this.commentMapper::getCommentDtoFromObject).toList();
        return PhotoDto
                .builder()
                .id(photo.getId())
                .likesCount(photo.getLikesCount())
                .path(finalPhotoPath)
                .userDto(userDto)
                .commentDtos(commentDtos)
                .build();
    }
}
