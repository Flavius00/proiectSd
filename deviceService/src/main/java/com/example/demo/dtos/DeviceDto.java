package com.example.demo.dtos;

import java.util.Objects;
import java.util.UUID;

public class DeviceDto {
    private UUID id;
    private String name;

    public DeviceDto() {}
    public DeviceDto(UUID id, String name) {
        this.id = id; this.name = name;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DeviceDto that = (DeviceDto) o;
        return Objects.equals(name, that.name);
    }
    @Override public int hashCode() { return Objects.hash(name); }
}
