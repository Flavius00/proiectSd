package com.example.demo.dtos;

import java.io.Serializable;
import java.util.UUID;

public class NotificationDTO implements Serializable {
    private String message;
    private UUID userId;
    private UUID deviceId;

    public NotificationDTO() {
    }

    public NotificationDTO(String message, UUID userId, UUID deviceId) {
        this.message = message;
        this.userId = userId;
        this.deviceId = deviceId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(UUID deviceId) {
        this.deviceId = deviceId;
    }
}