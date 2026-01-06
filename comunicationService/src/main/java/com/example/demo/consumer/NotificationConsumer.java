package com.example.demo.consumer;

import com.example.demo.dtos.NotificationDTO;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class NotificationConsumer {

    private final SimpMessagingTemplate messagingTemplate;

    // SimpMessagingTemplate este injectat automat de Spring Boot pentru a trimite mesaje WebSocket
    public NotificationConsumer(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @RabbitListener(queues = "notification-queue")
    public void consumeNotification(NotificationDTO notification) {
        try {
            System.out.println("Sending notification to user: " + notification.getUserId());

            // Construim destinația dinamică bazată pe ID-ul utilizatorului
            // Frontend-ul trebuie să facă subscribe la: /topic/user/{userId}/notification
            String destination = "/topic/user/" + notification.getUserId() + "/notification";

            // Trimitem obiectul către toți abonații acelui topic (în cazul nostru, browserul user-ului)
            messagingTemplate.convertAndSend(destination, notification);

        } catch (Exception e) {
            System.err.println("Error sending WebSocket notification: " + e.getMessage());
        }
    }
}