package com.example.demo.dtos;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Objects;
import java.util.UUID;

public class DeviceDetailsDto {

    private UUID id;

    @NotBlank(message = "name is required")
    private String name;

    @NotNull(message = "Maximum consumption is required")
    private Float maximumConsumption;

    private UUID userId;

    public DeviceDetailsDto() {
    }

    public DeviceDetailsDto(String name, Float maximumConsumption) {
        this.name = name;
        this.maximumConsumption = maximumConsumption;
    }

    public DeviceDetailsDto(UUID id, String name, Float maximumConsumption, UUID userId) {
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DeviceDetailsDto that = (DeviceDetailsDto) o;
        return  Objects.equals(name, that.name) &&
                Objects.equals(maximumConsumption, that.maximumConsumption) &&
                Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, maximumConsumption);
    }
}
