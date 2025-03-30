package com.photo.forum.backend.services;

import java.util.Map;
import java.util.Optional;

import javax.naming.directory.InvalidAttributeValueException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.photo.forum.backend.model.dto.UserDto;
import com.photo.forum.backend.model.entity.User;
import com.photo.forum.backend.model.mappers.UserMapper;
import com.photo.forum.backend.repositories.UserRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Setter;

@Setter
@Service
public class AuthService {

    private UserDto userDto;
    private String userLogin;
    private HttpServletRequest httpServletRequest;
    private HttpServletResponse httpServletResponse;

    private final UserMapper userMapper;
    private final UserService userService;
    private final TokenService tokenService;
    private final CookieService cookieService;
    private final UserRepository userRepository;
    private final ValidationService validationService;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthService(UserMapper userMapper, UserService userService, TokenService tokenService,
            CookieService cookieService,
            UserRepository userRepository, ValidationService validationService,
            AuthenticationManager authenticationManager) {
        this.userMapper = userMapper;
        this.userService = userService;
        this.tokenService = tokenService;
        this.cookieService = cookieService;
        this.userRepository = userRepository;
        this.validationService = validationService;
        this.authenticationManager = authenticationManager;
    }

    public ResponseEntity<?> getLoginResponseEntity() {
        try {
            User user = this.userMapper.getUserFromDto(userDto);
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    user.getLogin(),
                    user.getPassword());
            User databaseUser = this.getUserObjectFromDatabase(user);
            this.authenticationManager.authenticate(authentication);
            this.tokenService.addTokensToResponse(databaseUser.getLogin(), httpServletResponse);
            return ResponseEntity.status(HttpStatus.OK).body(databaseUser.getName());
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Unsuccessfull login try for user with dto: " + userDto.toString());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    public ResponseEntity<?> getRegisterResponseEntity() {
        try {
            boolean isUserDtoObjectValid = this.validationService.isUserObjectValid(userDto);
            if (isUserDtoObjectValid) {
                User user = this.userMapper.getUserFromDto(userDto);
                this.userService.setHashedPassword(user);
                this.userRepository.save(user);
                return ResponseEntity.status(HttpStatus.OK).build();
            }
            throw new InvalidAttributeValueException("Invalid user dto object");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Unsucessfull register try for user with dto: " + userDto.toString());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    public ResponseEntity<?> getRefreshTokensResponseEntity() {
        try {
            Cookie[] cookiesArray = this.httpServletRequest.getCookies();
            Map<String, Cookie> tokensList = this.cookieService.getTokensFromRequestCookies(cookiesArray);
            String refreshTokenValue = tokensList.get("REFRESH_TOKEN").getValue();
            this.userLogin = this.tokenService.getClaimFromToken("subject", refreshTokenValue);
            this.tokenService.addTokensToResponse(userLogin, httpServletResponse);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Unsuccessfull try for refresh tokens");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> getLogoutUserResponseEntity() {
        try {
            Cookie accessTokenExpiredCookie = this.cookieService.getCookie("ACCESS_TOKEN", "", true);
            Cookie refreshTokenExpiredCookie = this.cookieService.getCookie("REFRESH_TOKEN", "", true);
            this.httpServletResponse.addCookie(accessTokenExpiredCookie);
            this.httpServletResponse.addCookie(refreshTokenExpiredCookie);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Unsuccessfull try for logout user");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    private User getUserObjectFromDatabase(User user) throws UsernameNotFoundException {
        Optional<User> databaseUser = this.userRepository.findByLogin(user.getLogin());
        if (databaseUser.isPresent()) {
            return databaseUser.get();
        }
        throw new UsernameNotFoundException("User with login " + user.getLogin() + " was not founded.");
    }

}
