package com.photo.forum.backend.model.mappers;

import org.springframework.stereotype.Component;

import com.photo.forum.backend.model.dto.UserDto;
import com.photo.forum.backend.model.entity.User;

@Component
public class UserMapper {

    public User getUserFromDto(UserDto userDto) {
        return User
                .builder()
                .name(userDto.getName())
                .surname(userDto.getSurname())
                .login(userDto.getLogin())
                .password(userDto.getPassword())
                .build();
    }

    public UserDto getUserDtoFromObject(User user) {
        return UserDto
                .builder()
                .name(user.getName())
                .surname(user.getSurname())
                .login(user.getLogin())
                .password(user.getPassword())
                .build();
    }

    public UserDto getUserDtoWithoutCriticalData(User user) {
        boolean isAvatarPathNull = user.getAvatarPath() == null;
        String finalAvatarPath = isAvatarPathNull ? null : user.getAvatarPath().replace("/media/", "");
        return UserDto
                .builder()
                .name(user.getName())
                .surname(user.getSurname())
                .login(user.getLogin())
                .avatarPath(finalAvatarPath)
                .build();
    }
}
