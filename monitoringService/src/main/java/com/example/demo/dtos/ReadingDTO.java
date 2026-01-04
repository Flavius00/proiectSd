package com.example.demo.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

public class ReadingDTO {
    private UUID id;
    private Double reading;

    @JsonProperty("deviceId")
    private UUID deviceId;

    private Long timeStamp;

    public ReadingDTO() {}
    public ReadingDTO(UUID id, Double reading, UUID deviceId, Long timeStamp) {
        this.id = id; this.reading = reading; this.deviceId = deviceId; this.timeStamp = timeStamp;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Double getReading() { return reading; }
    public void setReading(Double reading) { this.reading = reading; }

    public UUID getDeviceId() { return deviceId; }
    public void setDeviceId(UUID deviceId) { this.deviceId = deviceId; }

    public Long getTimeStamp() { return timeStamp; }
    public void setTimeStamp(Long timeStamp) { this.timeStamp = timeStamp; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReadingDTO that = (ReadingDTO) o;
        return deviceId == that.deviceId && Objects.equals(reading, that.reading);
    }
    @Override public int hashCode() { return Objects.hash(reading, deviceId); }
}
