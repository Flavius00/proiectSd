package com.example.demo.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {
    @Bean
    public Queue deviceSyncQueue() {
        // Aceasta este coada pe care ascultă deja MonitoringService-ul tău
        return new Queue("device-sync-queue", true);
    }

    @Bean
    public Queue userSyncQueue() {
        // Coada pe care ascultăm userii noi
        return new Queue("user-sync-queue", true);
    }
}