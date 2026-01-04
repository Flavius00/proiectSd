package com.example.demo.dtos;

import java.util.List;
import java.util.UUID;

public class DeviceChartDataDTO {
    private UUID deviceId;
    private String name;
    private double maximumConsumption;
    private List<ReadingDTO> readings;

    public DeviceChartDataDTO(UUID deviceId, String name, double maximumConsumption, List<ReadingDTO> readings) {
        this.deviceId = deviceId;
        this.name = name;
        this.maximumConsumption = maximumConsumption;
        this.readings = readings;
    }

    // Getters și Setters
    public UUID getDeviceId() { return deviceId; }
    public void setDeviceId(UUID deviceId) { this.deviceId = deviceId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public double getMaximumConsumption() { return maximumConsumption; }
    public void setMaximumConsumption(double maximumConsumption) { this.maximumConsumption = maximumConsumption; }
    public List<ReadingDTO> getReadings() { return readings; }
    public void setReadings(List<ReadingDTO> readings) { this.readings = readings; }
}