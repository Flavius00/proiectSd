package com.example.demo.dtos;

import java.util.UUID;

public class MonitoringDeviceDTO {

    private UUID id;
    private String name;
    private Double maximumConsumption;
    private UUID userId;

    public MonitoringDeviceDTO(UUID id, String name, Double maximumConsumption, UUID userId) {
        this.id = id;
        this.name = name;
        this.maximumConsumption = maximumConsumption;
        this.userId = userId;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Double getMaximumConsumption() {
        return maximumConsumption;
    }

    public void setMaximumConsumption(Double maximumConsumption) {
        this.maximumConsumption = maximumConsumption;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
