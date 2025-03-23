package com.photo.forum.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.photo.forum.backend.model.dto.UserDto;
import com.photo.forum.backend.services.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PatchMapping("/edit")
    public ResponseEntity<?> editUser(@RequestBody UserDto userDto, HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse) {
        this.userService.setUserDto(userDto);
        this.userService.setHttpServletRequest(httpServletRequest);
        this.userService.setHttpServletResponse(httpServletResponse);
        return this.userService.getUserEditResponseEntity();
    }

    @GetMapping("/get-favourite-photos")
    public ResponseEntity<?> getFavouritePhotos(HttpServletRequest httpServletRequest) {
        this.userService.setHttpServletRequest(httpServletRequest);
        return this.userService.getFavouritePhotosResponseEntity();
    }
}
