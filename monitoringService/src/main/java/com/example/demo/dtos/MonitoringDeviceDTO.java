package com.example.demo.dtos;

import java.util.UUID;

public class MonitoringDeviceDTO {

    private UUID id;
    private Double maximumHourlyConsumption;
    private UUID userId;

    public MonitoringDeviceDTO(UUID id, Double maximumHourlyConsumption, UUID userId) {
        this.id = id;
        this.maximumHourlyConsumption = maximumHourlyConsumption;
        this.userId = userId;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Double getMaximumHourlyConsumption() {
        return maximumHourlyConsumption;
    }

    public void setMaximumHourlyConsumption(Double maximumHourlyConsumption) {
        this.maximumHourlyConsumption = maximumHourlyConsumption;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }
}
