package com.example.demo.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;


import java.io.Serializable;
import java.util.UUID;

@Entity
public class Device implements Serializable{

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @UuidGenerator
    @JdbcTypeCode(SqlTypes.UUID)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "maximum_consumption", nullable = false)
    private Float maximumConsumption;

    @Column(name = "user_id", nullable = true)
    private UUID userId;

    public Device() {
    }

    public Device(String name, Float maximumConsumption, UUID userId) {
        this.name = name;
        this.maximumConsumption = maximumConsumption;
        this.userId = userId;
    }

    public Device(UUID id, String name, Float maximumConsumption,  UUID userId) {
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Float getMaximumConsumption() {
        return maximumConsumption;
    }

    public void setMaximumConsumption(Float maximumConsumption) {
        this.maximumConsumption = maximumConsumption;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }
}
