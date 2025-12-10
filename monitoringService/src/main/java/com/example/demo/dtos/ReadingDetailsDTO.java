package com.example.demo.dtos;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Objects;
import java.util.UUID;

public class ReadingDetailsDTO {

    private UUID id;

    @NotBlank(message = "device name is required")
    private String deviceName;
    @NotNull(message = "reading is required")
    private Double reading;
    @NotBlank(message = "age is required")
    private UUID deviceId;

    private Long timeStamp;

    public ReadingDetailsDTO() {
    }

    public ReadingDetailsDTO(String deviceName, Double reading, UUID deviceId) {
        this.deviceName = deviceName;
        this.reading = reading;
        this.deviceId = deviceId;
    }

    public ReadingDetailsDTO(UUID id, String deviceName, Double reading, UUID deviceId, Long timeStamp) {
        this.id = id;
        this.deviceName = deviceName;
        this.reading = reading;
        this.deviceId = deviceId;
        this.timeStamp = timeStamp;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public Double getReading() {
        return reading;
    }

    public void setReading(Double reading) {
        this.reading = reading;
    }

    public UUID getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(UUID deviceId) {
        this.deviceId = deviceId;
    }

    public Long getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(Long timeStamp) {
        this.timeStamp = timeStamp;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReadingDetailsDTO that = (ReadingDetailsDTO) o;
        return deviceId == that.deviceId &&
                Objects.equals(deviceName, that.deviceName) &&
                Objects.equals(reading, that.reading);
    }

    @Override
    public int hashCode() {
        return Objects.hash(deviceName, reading, deviceId);
    }
}
