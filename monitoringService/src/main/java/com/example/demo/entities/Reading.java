package com.example.demo.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;


import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class Reading implements Serializable{

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @UuidGenerator
    @JdbcTypeCode(SqlTypes.UUID)
    private UUID id;

    @Column(name = "device_name", nullable = false)
    private String deviceName;

    @Column(name = "device_id", nullable = false)
    private UUID deviceId;

    @Column(name = "reading", nullable = false)
    private Double reading;

    @Column(name = "time_stamp", nullable = false)
    private Long timeStamp;


    public Reading() {
    }

    public Reading(String deviceName, Double reading, UUID deviceId, Long timeStamp) {
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

    public void setDeviceName(String name) {
        this.deviceName = name;
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
}
