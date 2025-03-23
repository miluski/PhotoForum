package com.photo.forum.backend.services;

import java.util.Collections;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.photo.forum.backend.model.entity.User;
import com.photo.forum.backend.repositories.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByLogin(login);
        if (user.isPresent()) {
            User retrievedUser = user.get();
            String retrievedUserLogin = retrievedUser.getLogin();
            String retrievedUserPassword = retrievedUser.getPassword();
            return new org.springframework.security.core.userdetails.User(
                    retrievedUserLogin, retrievedUserPassword, Collections.emptyList());
        }
        throw new UsernameNotFoundException("User with login: " + login + " was not found.");
    }
}
