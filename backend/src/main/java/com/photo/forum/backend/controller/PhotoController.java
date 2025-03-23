package com.photo.forum.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.photo.forum.backend.model.dto.PhotoDto;
import com.photo.forum.backend.services.PhotoService;
import com.photo.forum.backend.services.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v1/photos")
public class PhotoController {

    private final UserService userService;
    private final PhotoService photoService;

    @Autowired
    public PhotoController(UserService userService, PhotoService photoService) {
        this.userService = userService;
        this.photoService = photoService;
    }

    @GetMapping("/posts")
    public ResponseEntity<?> getAllPhotosPosts() {
        return this.photoService.getAllPhotoResponseEntity();
    }

    @GetMapping("/public/{name}")
    public ResponseEntity<?> getImageByName(@PathVariable String name) {
        this.photoService.setPhotoName(name);
        return this.photoService.getPhotoResponseEntity();
    }

    @PostMapping("/new")
    public ResponseEntity<?> addNewPhoto(@RequestBody PhotoDto photoDto, HttpServletRequest httpServletRequest) {
        this.userService.setHttpServletRequest(httpServletRequest);
        return this.photoService.getAddPhotoResponseEntity(photoDto);
    }

    @PostMapping("/{id}/add-comment")
    public ResponseEntity<?> addCommentToImage(@PathVariable String id, @RequestBody String commentContent,
            HttpServletRequest httpServletRequest) {
        this.photoService.setPhotoId(id);
        this.photoService.setCommentContent(commentContent);
        this.userService.setHttpServletRequest(httpServletRequest);
        return this.photoService.getAddCommentToPhotoResponseEntity();
    }

    @PostMapping("/{id}/add-to-favourites")
    public ResponseEntity<?> addPhotoToUserFavourites(@PathVariable String id, HttpServletRequest httpServletRequest) {
        this.photoService.setPhotoId(id);
        this.userService.setHttpServletRequest(httpServletRequest);
        return this.photoService.getAddPhotoToFavouritesResponseEntity();
    }

    @DeleteMapping("/{id}/remove-from-favourites")
    public ResponseEntity<?> removePhotoFromUserFavourites(@PathVariable String id,
            HttpServletRequest httpServletRequest) {
        this.photoService.setPhotoId(id);
        this.userService.setHttpServletRequest(httpServletRequest);
        return this.photoService.getRemoveFromFavouritesResponseEntity();
    }
}
