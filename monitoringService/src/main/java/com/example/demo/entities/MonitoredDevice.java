package com.example.demo.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serializable;
import java.util.UUID;

@Entity
public class MonitoredDevice implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @JdbcTypeCode(SqlTypes.UUID)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "maximum_consumption", nullable = false)
    private Double maximumConsumption;

    @Column(name = "user_id",  nullable = false)
    private UUID userId;

    public MonitoredDevice() {}

    public MonitoredDevice(UUID userId, Double maximumConsumption) {
        this.userId = userId;
        this.maximumConsumption = maximumConsumption;
    }

    public MonitoredDevice(UUID monitoredDeviceId, String name, Double maximumConsumption, UUID userId) {
        this.id = monitoredDeviceId;
        this.name = name;
        this.maximumConsumption = maximumConsumption;
        this.userId = userId;
    }

    public Double getMaximumConsumption() {
        return maximumConsumption;
    }

    public void setMaximumConsumption(Double maximumHourlyConsumption) {
        this.maximumConsumption = maximumHourlyConsumption;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }
    public void setName(String deviceName) {
        this.name = deviceName;
    }
}
