package com.example.demo.dtos.builders;

import com.example.demo.dtos.UserDTO;
import com.example.demo.dtos.UserDetailsDTO;
import com.example.demo.dtos.roles.UserRoles;
import com.example.demo.entities.User;

public class UserBuilder {

    private UserBuilder() {
    }

    public static UserDTO toUserDTO(User user) {
        return new UserDTO(user.getId(), user.getEmail(), user.getPassword());
    }

    public static UserDetailsDTO toUserDetailsDTO(User user) {
        return new UserDetailsDTO(user.getId(), user.getUsername(), user.getEmail(), user.getPassword());
    }

    public static User toEntity(UserDetailsDTO userDetailsDTO) {
        return new User(

                userDetailsDTO.getEmail(),
                userDetailsDTO.getUsername(),
                userDetailsDTO.getPassword(),
                UserRoles.USER_ROLE
        );
    }
}
