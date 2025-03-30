package com.photo.forum.backend.model.mappers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.photo.forum.backend.model.dto.CommentDto;
import com.photo.forum.backend.model.dto.UserDto;
import com.photo.forum.backend.model.entity.Comment;

@Component
public class CommentMapper {

    private final UserMapper userMapper;

    @Autowired
    public CommentMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public CommentDto getCommentDtoFromObject(Comment comment) {
        UserDto userDto = this.userMapper.getUserDtoWithoutCriticalData(comment.getUser());
        return CommentDto
                .builder()
                .content(comment.getContent())
                .date(comment.getAddDate())
                .userDto(userDto)
                .build();
    }

}
