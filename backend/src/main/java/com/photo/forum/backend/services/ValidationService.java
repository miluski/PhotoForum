package com.photo.forum.backend.services;

import java.util.Optional;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.photo.forum.backend.model.dto.UserDto;
import com.photo.forum.backend.model.entity.User;
import com.photo.forum.backend.repositories.UserRepository;

@Service
public class ValidationService {

    private final UserRepository userRepository;

    @Autowired
    public ValidationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean isUserObjectValid(UserDto userDto) {
        boolean isNameValid = this.isNameValid(userDto.getName());
        boolean isSurnameValid = this.isSurnameValid(userDto.getSurname());
        boolean isLoginValid = this.isLoginValid(userDto.getLogin());
        boolean isLoginNotExists = this.isUserLoginNotExists(userDto.getLogin());
        boolean isPasswordValid = this.isPasswordValid(userDto.getPassword());
        return isNameValid && isSurnameValid && isLoginValid && isLoginNotExists && isPasswordValid;
    }

    public boolean isEditedUserObjectValid(UserDto userDto) {
        return userDto.getName() != null || userDto.getSurname() != null || userDto.getLogin() != null
                || userDto.getPassword() != null || userDto.getAvatarPath() != null;
    }

    public boolean isNameValid(String name) {
        return name != null && name.length() >= 3 && name.length() <= 50;
    }

    public boolean isSurnameValid(String surname) {
        return surname != null && surname.length() >= 5 && surname.length() <= 60;
    }

    public boolean isLoginValid(String login) {
        return login != null && login.length() >= 5 && login.length() <= 20;
    }

    public boolean isPasswordValid(String password) {
        String passwordPattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";
        return password != null && Pattern.matches(passwordPattern, password);
    }

    public boolean isCommentContentValid(String commentContent) {
        return commentContent != null && commentContent.length() >= 10 && commentContent.length() <= 100;
    }

    public boolean isUserLoginNotExists(String login) {
        Optional<User> user = this.userRepository.findByLogin(login);
        return user.isEmpty();
    }

}
