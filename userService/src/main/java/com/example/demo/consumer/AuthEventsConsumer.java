package com.example.demo.consumer;

import com.example.demo.dtos.UserSyncDTO;
import com.example.demo.entities.User;
import com.example.demo.repositories.UserRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class AuthEventsConsumer {

    private final UserRepository userRepository;
    private final RabbitTemplate rabbitTemplate; // <--- Injectam RabbitTemplate

    public AuthEventsConsumer(UserRepository userRepository, RabbitTemplate rabbitTemplate) {
        this.userRepository = userRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    @RabbitListener(queues = "auth-user-queue")
    public void consumeMessage(UserSyncDTO message) {
        System.out.println("UserService: Received from Auth -> " + message);

        try {
            if ("CREATE".equals(message.getEventType())) {
                User user = new User();
                user.setId(message.getId());
                user.setUsername(message.getUsername());
                user.setFirstName(message.getFirstName());
                user.setLastName(message.getLastName());
                user.setAddress(message.getAddress());
                user.setAge(message.getAge());
                userRepository.save(user);

            } else if ("DELETE".equals(message.getEventType())) {
                if (userRepository.existsById(message.getId())) {
                    userRepository.deleteById(message.getId());
                }
            }


            rabbitTemplate.convertAndSend("user-device-queue", message);
            System.out.println("UserService: Forwarded to Device -> " + message.getId());

        } catch (Exception e) {
            System.err.println("Error processing in UserService: " + e.getMessage());
        }
    }
}