package com.example.demo.consumer;

import com.example.demo.dtos.UserSyncDTO; // Asigura-te ca ai importat clasa corecta
import com.example.demo.repositories.UserSyncRepository;
import com.example.demo.entities.UserSync;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class UserMessageConsumer {

    private final UserSyncRepository userSyncRepository;

    public UserMessageConsumer(UserSyncRepository userSyncRepository) {
        this.userSyncRepository = userSyncRepository;
    }

    @RabbitListener(queues = "user-device-queue")
    public void consumeUserSync(UserSyncDTO message) {
        System.out.println("DeviceService received sync message: " + message);

        try {
            if ("CREATE".equals(message.getEventType())) {
                UserSync userSync = new UserSync();
                userSync.setId(message.getId());
                userSyncRepository.save(userSync);
                System.out.println("DeviceService: User ID saved for validation.");
            }
            else if ("DELETE".equals(message.getEventType())) {
                if (userSyncRepository.existsById(message.getId())) {
                    userSyncRepository.deleteById(message.getId());
                    System.out.println("DeviceService: User ID deleted.");
                }
            }
        } catch (Exception e) {
            System.err.println("Error syncing user to device service: " + e.getMessage());
        }
    }
}