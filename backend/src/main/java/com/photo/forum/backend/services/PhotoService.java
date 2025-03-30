package com.photo.forum.backend.services;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.photo.forum.backend.model.dto.PhotoDto;
import com.photo.forum.backend.model.entity.Comment;
import com.photo.forum.backend.model.entity.FavouritePhoto;
import com.photo.forum.backend.model.entity.Photo;
import com.photo.forum.backend.model.entity.User;
import com.photo.forum.backend.model.mappers.PhotoMapper;
import com.photo.forum.backend.repositories.CommentRepository;
import com.photo.forum.backend.repositories.FavouritePhotoRepository;
import com.photo.forum.backend.repositories.PhotoRepository;
import com.photo.forum.backend.repositories.UserRepository;

import lombok.Setter;

@Service
@Setter
public class PhotoService {

    @Value("${photo.dir}")
    private String photoDir;

    private String photoId;
    private String photoName;
    private String commentContent;

    private final UserService userService;
    private final PhotoMapper photoMapper;
    private final PhotoRepository photoRepository;
    private final ValidationService validationService;
    private final CommentRepository commentRepository;
    private final FavouritePhotoRepository favouritePhotoRepository;

    @Autowired
    public PhotoService(UserService userService, PhotoMapper photoMapper,
            CookieService cookieService,
            UserRepository userRepository,
            PhotoRepository photoRepository, ValidationService validationService,
            CommentRepository commentRepository, FavouritePhotoRepository favouritePhotoRepository) {
        this.userService = userService;
        this.photoMapper = photoMapper;
        this.photoRepository = photoRepository;
        this.validationService = validationService;
        this.commentRepository = commentRepository;
        this.favouritePhotoRepository = favouritePhotoRepository;
    }

    public ResponseEntity<?> getAllPhotoResponseEntity() {
        try {
            List<Photo> photos = this.photoRepository.findAll();
            if (photos.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            } else {
                List<PhotoDto> photoDtos = photos.stream().map(photoMapper::getPhotoDtoFromObject).toList();
                return ResponseEntity.status(HttpStatus.OK).body(photoDtos);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> getPhotoResponseEntity() {
        try {
            Resource resource = this.getPhotoResource();
            if (resource != null && resource.exists()) {
                HttpHeaders httpHeaders = this.getHeaders(resource);
                return ResponseEntity.status(HttpStatus.OK).headers(httpHeaders).body(resource);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Unsuccessfull try to get photo with name " + photoName + " from directory " + photoDir);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> getAddPhotoResponseEntity(PhotoDto photoDto) {
        try {
            User user = this.userService.getFoundedUser();
            String photoPath = this.userService.getSavedPhotoPath(photoDir, photoDto.getPath());
            Photo photo = this.photoMapper.getPhotoFromDto(photoDto, user, photoPath);
            this.photoRepository.save(photo);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NotFoundException e) {
            e.printStackTrace();
            System.out.println("Some element needed for add coment to photo was not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(
                    "Unsuccessfull try to save photo with name " + photoDto.toString() + " in directory " + photoDir);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> getAddCommentToPhotoResponseEntity() {
        try {
            boolean isCommentContentValid = this.validationService.isCommentContentValid(commentContent);
            if (isCommentContentValid) {
                this.addComment();
                return ResponseEntity.status(HttpStatus.OK).build();
            }
            throw new Exception("Invalid comment content.");
        } catch (NotFoundException e) {
            e.printStackTrace();
            System.out.println("Some element needed for add coment to photo was not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> getAddPhotoToFavouritesResponseEntity() {
        try {
            this.addToFavourites();
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NotFoundException e) {
            e.printStackTrace();
            System.out.println("Some element needed for add coment to photo was not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> getRemoveFromFavouritesResponseEntity() {
        try {
            this.removeFromFavourites();
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (NotFoundException e) {
            e.printStackTrace();
            System.out.println("Some element needed for add coment to photo was not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private Resource getPhotoResource() throws MalformedURLException {
        Path path = Paths.get(photoDir).resolve(photoName).normalize();
        Resource resource = new UrlResource(path.toUri());
        return resource.exists() ? resource : null;
    }

    private HttpHeaders getHeaders(Resource resource) throws IOException {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(HttpHeaders.CONTENT_TYPE, this.getContentType());
        httpHeaders.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"");
        httpHeaders.add(HttpHeaders.CONTENT_LENGTH, String.valueOf(resource.contentLength()));
        return httpHeaders;
    }

    private String getContentType() {
        String contentType = "application/octet-stream";
        if (this.photoName.endsWith(".png")) {
            contentType = "image/png";
        } else if (this.photoName.endsWith(".jpeg")) {
            contentType = "image/jpeg";
        } else if (this.photoName.endsWith(".jpg")) {
            contentType = "image/jpg";
        } else if (this.photoName.endsWith(".webp")) {
            contentType = "image/webp";
        }
        return contentType;
    }

    private void addComment() throws NotFoundException {
        Comment comment = new Comment();
        comment.setUser(this.userService.getFoundedUser());
        comment.setPhoto(this.getFoundedPhoto());
        comment.setContent(commentContent);
        comment.setAddDate(new Date(System.currentTimeMillis()));
        commentRepository.save(comment);
    }

    private void addToFavourites() throws NotFoundException {
        User user = this.userService.getFoundedUser();
        Photo photo = this.getFoundedPhoto();
        this.changePhotoLikesCount(photo, "increment");
        this.saveFavouritePhotoEntity(photo, user);
    }

    private void removeFromFavourites() throws NotFoundException {
        User user = this.userService.getFoundedUser();
        Photo photo = this.getFoundedPhoto();
        FavouritePhoto favouritePhoto = this.getFoundedFavouritePhoto(user, photo);
        this.favouritePhotoRepository.delete(favouritePhoto);
        this.changePhotoLikesCount(photo, "decrement");
    }

    private Photo getFoundedPhoto() throws NotFoundException {
        Long convertedPhotoId = Long.valueOf(photoId);
        Optional<Photo> photo = this.photoRepository.findById(convertedPhotoId);
        if (photo.isEmpty()) {
            throw new NotFoundException();
        }
        return photo.get();
    }

    private void changePhotoLikesCount(Photo photo, String changeType) {
        boolean isIncrementing = changeType.equals("increment");
        Integer photoLikesCount = photo.getLikesCount();
        Integer changedLikesCount = isIncrementing ? photoLikesCount + 1 : photoLikesCount - 1;
        photo.setLikesCount(changedLikesCount);
        this.photoRepository.save(photo);
    }

    private void saveFavouritePhotoEntity(Photo photo, User user) {
        FavouritePhoto favouritePhoto = new FavouritePhoto();
        favouritePhoto.setPhoto(photo);
        favouritePhoto.setUser(user);
        this.favouritePhotoRepository.save(favouritePhoto);
    }

    private FavouritePhoto getFoundedFavouritePhoto(User user, Photo photo) throws NotFoundException {
        Optional<FavouritePhoto> favouritePhoto = this.favouritePhotoRepository.findByUserAndPhoto(user, photo);
        if (favouritePhoto.isEmpty()) {
            throw new NotFoundException();
        }
        return favouritePhoto.get();
    }
}
