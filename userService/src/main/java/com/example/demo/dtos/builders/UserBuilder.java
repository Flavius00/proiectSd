package com.example.demo.dtos.builders;

import com.example.demo.dtos.UserDTO;
import com.example.demo.dtos.UserDetailsDTO;
import com.example.demo.entities.User;

public class UserBuilder {

    private UserBuilder() {
    }

    public static UserDTO toUserDTO(User user) {
        return new UserDTO(user.getId(), user.getUsername(), user.getAge());
    }

    public static UserDetailsDTO toUserDetailsDTO(User user) {
        return new UserDetailsDTO(user.getId(), user.getUsername(), user.getFirstName(), user.getAddress(), user.getLastName(), user.getAge());
    }

    public static User toEntity(UserDetailsDTO userDetailsDTO) {
        return new User(
                userDetailsDTO.getId(),
                userDetailsDTO.getUsername(),
                userDetailsDTO.getFirstName(),
                userDetailsDTO.getAddress(),
                userDetailsDTO.getLastName(),
                userDetailsDTO.getAge());
    }
}
