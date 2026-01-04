package com.example.demo.services;

import com.example.demo.dtos.RegisterRequest;
import com.example.demo.dtos.UserSyncDTO;
import com.example.demo.entities.User;
import com.example.demo.repositories.UserRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RabbitTemplate rabbitTemplate;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, RabbitTemplate rabbitTemplate) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.rabbitTemplate = rabbitTemplate;
    }

    public void register(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);

        UserSyncDTO syncMessage = new UserSyncDTO(
                savedUser.getId(),
                savedUser.getUsername(),
                request.getFirstName(),
                request.getLastName(),
                request.getAddress(),
                request.getAge(),
                "CREATE"
        );

        rabbitTemplate.convertAndSend("auth-user-queue", syncMessage);
        System.out.println("AuthService: Sent CREATE for user " + user.getUsername());
    }

    public void deleteUser(UUID id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);

            UserSyncDTO syncMessage = new UserSyncDTO(
                    id,
                    null,
                    null,
                    null,
                    null,
                    0,
                    "DELETE"
            );

            rabbitTemplate.convertAndSend("auth-user-queue", syncMessage);
            System.out.println("AuthService: Sent DELETE for user " + id);
        }
    }
}