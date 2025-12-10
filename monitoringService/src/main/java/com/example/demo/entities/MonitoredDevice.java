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

    @Column(name = "maximum_hourly_consumption", nullable = false)
    private Double maximumHourlyConsumption;

    @Column(name = "user_id",  nullable = false)
    private UUID userId;

    public MonitoredDevice() {}

    public MonitoredDevice(UUID userId, Double maximumHourlyConsumption) {
        this.userId = userId;
        this.maximumHourlyConsumption = maximumHourlyConsumption;
    }

    public MonitoredDevice(UUID monitoredDeviceId, Double maximumHourlyConsumption, UUID userId) {
        this.id = monitoredDeviceId;
        this.maximumHourlyConsumption = maximumHourlyConsumption;
        this.userId = userId;
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

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getId() {
        return id;
    }
}
