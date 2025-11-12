package com.example.demo.services;


import com.example.demo.dtos.UserDetailsDTO;
import com.example.demo.dtos.builders.UserBuilder;
import com.example.demo.entities.User;
import com.example.demo.handlers.exceptions.model.ResourceNotFoundException;
import com.example.demo.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDetailsDTO findUserById(UUID id) {
        Optional<User> prosumerOptional = userRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("User with id {} was not found in db", id);
            throw new ResourceNotFoundException(User.class.getSimpleName() + " with id: " + id);
        }
        return UserBuilder.toUserDetailsDTO(prosumerOptional.get());
    }

    public UUID deleteUser(UUID id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            userRepository.deleteById(id);
            return id;
        }
        else
            return null;
    }

    public UUID insert(UserDetailsDTO userDto) {
        User user = UserBuilder.toEntity(userDto);
        user = userRepository.save(user);
        LOGGER.debug("Person with id {} was inserted in db", user.getId());
        return user.getId();
    }

    public void update(UserDetailsDTO userDTO) {
        Optional<User> userDb = userRepository.findById(userDTO.getId());
        userDTO.setPassword("ceva");
        User user = UserBuilder.toEntity(userDTO);
        user.setId(userDTO.getId());
        user.setPassword(userDb.get().getPassword());
        user.setRole(userDb.get().getRole());
        user = userRepository.save(user);
        LOGGER.debug("User with id {} was updated in db", user.getId());

    }

}
