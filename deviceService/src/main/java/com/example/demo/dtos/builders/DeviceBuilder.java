package com.example.demo.dtos.builders;

import com.example.demo.dtos.DeviceDto;
import com.example.demo.dtos.DeviceDetailsDto;
import com.example.demo.entities.Device;

public class DeviceBuilder {

    private DeviceBuilder() {
    }

    public static DeviceDto toDeviceDto(Device device) {
        return new DeviceDto(device.getId(), device.getName());
    }

    public static DeviceDetailsDto toDeviceDetailsDTO(Device device) {
        return new DeviceDetailsDto(device.getId(), device.getName(), device.getMaximumConsumption(), device.getUserId());
    }

    public static Device toEntity(DeviceDetailsDto deviceDetailsDto) {
        return new Device(
                deviceDetailsDto.getId(),
                deviceDetailsDto.getName(),
                deviceDetailsDto.getMaximumConsumption(),
                deviceDetailsDto.getUserId()
        );
    }
}
