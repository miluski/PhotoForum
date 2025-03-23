package com.photo.forum.backend.services;

import java.io.FileOutputStream;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.photo.forum.backend.model.dto.FavouritePhotoDto;
import com.photo.forum.backend.model.dto.UserDto;
import com.photo.forum.backend.model.entity.FavouritePhoto;
import com.photo.forum.backend.model.entity.User;
import com.photo.forum.backend.model.mappers.FavouritePhotoMapper;
import com.photo.forum.backend.repositories.FavouritePhotoRepository;
import com.photo.forum.backend.repositories.UserRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Setter;

@Setter
@Service
public class UserService {

    @Value("${photo.dir}")
    private String photoDir;

    private User user;
    private UserDto userDto;
    private HttpServletRequest httpServletRequest;
    private HttpServletResponse httpServletResponse;

    private final TokenService tokenService;
    private final CookieService cookieService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ValidationService validationService;
    private final FavouritePhotoMapper favouritePhotoMapper;
    private final FavouritePhotoRepository favouritePhotoRepository;

    @Autowired
    public UserService(TokenService tokenService, CookieService cookieService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder, ValidationService validationService,
            FavouritePhotoMapper favouritePhotoMapper,
            FavouritePhotoRepository favouritePhotoRepository) {
        this.tokenService = tokenService;
        this.cookieService = cookieService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.validationService = validationService;
        this.favouritePhotoMapper = favouritePhotoMapper;
        this.favouritePhotoRepository = favouritePhotoRepository;
    }

    public ResponseEntity<?> getUserEditResponseEntity() {
        try {
            this.user = this.getFoundedUser();
            this.checkIfObjectIsNotEmpty();
            this.setEditedCredentials();
            this.userRepository.save(user);
            this.tokenService.addTokensToResponse(user.getLogin(), httpServletResponse);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NotFoundException e) {
            e.printStackTrace();
            System.out.println("Some of elements required to retrieve favourite photos was not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Unsuccessfull try to edit user with dto: " + userDto.toString());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    public ResponseEntity<?> getFavouritePhotosResponseEntity() {
        try {
            User user = this.getFoundedUser();
            List<FavouritePhoto> favouritePhotos = this.favouritePhotoRepository.findFavouritePhotosByUser(user);
            if (favouritePhotos.size() >= 1) {
                List<FavouritePhotoDto> favouritePhotoDtos = favouritePhotos.stream()
                        .map(this.favouritePhotoMapper::getFavouritePhotoDtoFromFavouritePhoto).toList();
                return ResponseEntity.status(HttpStatus.OK).body(favouritePhotoDtos);
            }
            throw new NotFoundException();
        } catch (NotFoundException e) {
            e.printStackTrace();
            System.out.println("Some of elements required to retrieve favourite photos was not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Unsuccessfull try to retrieve favourite photos.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public void setHashedPassword(User user) {
        String hashedPassword = this.passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
    }

    public User getFoundedUser() throws NotFoundException {
        String accessTokenValue = this.getAccessTokenValue();
        String userLogin = this.tokenService.getClaimFromToken("subject", accessTokenValue);
        Optional<User> user = this.userRepository.findByLogin(userLogin);
        if (user.isEmpty()) {
            throw new NotFoundException();
        }
        return user.get();
    }

    public String getSavedPhotoPath(String photoDir, String photo) throws Exception {
        try {
            String photoPath = this.photoDir + "/" + this.getRandomPhotoName(photo);
            String base64PhotoData = photo.split(",")[1];
            byte[] photoBytes = Base64.getDecoder().decode(base64PhotoData);
            FileOutputStream fileOutputStream = new FileOutputStream(photoPath);
            fileOutputStream.write(photoBytes);
            fileOutputStream.close();
            return photoPath;
        } catch (Exception e) {
            throw e;
        }
    }

    private String getRandomPhotoName(String image) {
        String extension = "";
        if (image.startsWith("data:image/png")) {
            extension = ".png";
        } else if (image.startsWith("data:image/jpg")) {
            extension = ".jpg";
        } else if (image.startsWith("data:image/jpeg")) {
            extension = ".jpeg";
        } else if (image.startsWith("data:image/webp")) {
            extension = ".webp";
        }
        String randomName = UUID.randomUUID().toString();
        return randomName + extension;
    }

    private String getAccessTokenValue() {
        Cookie[] cookiesArray = this.httpServletRequest.getCookies();
        Map<String, Cookie> tokensList = this.cookieService.getTokensFromRequestCookies(cookiesArray);
        return tokensList.get("ACCESS_TOKEN").getValue();
    }

    private void checkIfObjectIsNotEmpty() throws IllegalArgumentException {
        boolean isUserDtoObjectNotEmpty = this.validationService.isEditedUserObjectValid(userDto);
        if (isUserDtoObjectNotEmpty == false) {
            throw new IllegalArgumentException("UserDto object for edit is empty.");
        }
    }

    private void setEditedCredentials() throws Exception {
        this.setAvatarPath();
        this.setLogin();
        this.setName();
        this.setSurname();
        this.setPassword();
    }

    private void setAvatarPath() throws Exception {
        String dtoAvatarPath = userDto.getAvatarPath();
        if (dtoAvatarPath != null) {
            String savedPhotoPath = this.getSavedPhotoPath(photoDir, userDto.getAvatarPath());
            user.setAvatarPath(savedPhotoPath);
        }
    }

    private void setLogin() throws IllegalArgumentException {
        String dtoLogin = userDto.getLogin();
        boolean isDtoLoginValid = this.validationService.isLoginValid(dtoLogin);
        boolean isDtoLoginNotExists = this.validationService.isUserLoginNotExists(dtoLogin);
        if (isDtoLoginValid && isDtoLoginNotExists) {
            user.setLogin(dtoLogin);
            return;
        } else if (dtoLogin != null) {
            throw new IllegalArgumentException("Illegal login.");
        }
    }

    private void setName() throws IllegalArgumentException {
        String dtoName = userDto.getName();
        boolean isDtoNameValid = this.validationService.isNameValid(dtoName);
        if (isDtoNameValid) {
            user.setName(dtoName);
            return;
        } else if (dtoName != null) {
            throw new IllegalArgumentException("Illegal name.");
        }
    }

    private void setSurname() throws IllegalArgumentException {
        String dtoSurname = userDto.getSurname();
        boolean isDtoSurnameValid = this.validationService.isSurnameValid(dtoSurname);
        if (isDtoSurnameValid) {
            user.setSurname(dtoSurname);
            return;
        } else if (dtoSurname != null) {
            throw new IllegalArgumentException("Illegal surname.");
        }
    }

    private void setPassword() throws IllegalArgumentException {
        String dtoPassword = userDto.getPassword();
        boolean isDtoPasswordValid = this.validationService.isPasswordValid(dtoPassword);
        if (isDtoPasswordValid) {
            user.setPassword(dtoPassword);
            this.setHashedPassword(user);
            return;
        } else if (dtoPassword != null) {
            throw new IllegalArgumentException("Illegal password.");
        }
    }

}