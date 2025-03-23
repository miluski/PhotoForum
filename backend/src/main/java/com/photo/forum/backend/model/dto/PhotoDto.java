package com.photo.forum.backend.model.dto;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PhotoDto implements Serializable {

    private Long id;
    private String path;
    private UserDto userDto;
    private Integer likesCount;
    private List<CommentDto> commentDtos;

}
