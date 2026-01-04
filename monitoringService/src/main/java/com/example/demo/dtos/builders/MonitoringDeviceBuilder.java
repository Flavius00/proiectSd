package com.example.demo.dtos.builders;

import com.example.demo.dtos.MonitoringDeviceDTO;
import com.example.demo.entities.MonitoredDevice;

public class MonitoringDeviceBuilder {

    private MonitoringDeviceBuilder(){
    }

    public static MonitoringDeviceDTO toMonitoringDeviceDto(MonitoredDevice device){
        return new MonitoringDeviceDTO(device.getId(), device.getDeviceName(),device.getMaximumConsumption(), device.getUserId());
    }

    public static MonitoredDevice toEntity(MonitoringDeviceDTO monitoringDeviceDTO){
        return new MonitoredDevice(
                monitoringDeviceDTO.getId(),
                monitoringDeviceDTO.getName(),
                monitoringDeviceDTO.getMaximumConsumption(),
                monitoringDeviceDTO.getUserId()
        );
    }
}
