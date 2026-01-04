package com.example.demo.consumer;

import com.example.demo.entities.UserSync;
import com.example.demo.repositories.UserSyncRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
public class UserMessageConsumer {
    private final UserSyncRepository userSyncRepository;

    public UserMessageConsumer(UserSyncRepository userSyncRepository) {
        this.userSyncRepository = userSyncRepository;
    }

    @RabbitListener(queues = "user-sync-queue")
    public void consumeUserSync(UUID userId) {
        try {
            userSyncRepository.save(new UserSync(userId));
            System.out.println("User sincronizat in DeviceService: " + userId);
        } catch (Exception e) {
            System.err.println("Eroare la sincronizare user: " + e.getMessage());
        }
    }
}