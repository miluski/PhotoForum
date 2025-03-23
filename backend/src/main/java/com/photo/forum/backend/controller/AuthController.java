package com.photo.forum.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.photo.forum.backend.model.dto.UserDto;
import com.photo.forum.backend.services.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/is-authorized")
    public ResponseEntity<?> getIsAuthorized() {
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDto userDto, HttpServletResponse httpServletResponse) {
        this.authService.setUserDto(userDto);
        this.authService.setHttpServletResponse(httpServletResponse);
        return this.authService.getLoginResponseEntity();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDto userDto, HttpServletResponse httpServletResponse) {
        this.authService.setUserDto(userDto);
        this.authService.setHttpServletResponse(httpServletResponse);
        return this.authService.getRegisterResponseEntity();
    }

    @PostMapping("/refresh-tokens")
    public ResponseEntity<?> refreshTokens(HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse) {
        this.authService.setHttpServletRequest(httpServletRequest);
        this.authService.setHttpServletResponse(httpServletResponse);
        return this.authService.getRefreshTokensResponseEntity();
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletResponse httpServletResponse) {
        this.authService.setHttpServletResponse(httpServletResponse);
        return this.authService.getLogoutUserResponseEntity();
    }

}
