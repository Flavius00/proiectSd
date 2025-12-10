package com.example.demo.dtos.builders;

import com.example.demo.dtos.MonitoringDeviceDTO;
import com.example.demo.entities.MonitoredDevice;

public class MonitoringDeviceBuilder {

    private MonitoringDeviceBuilder(){
    }

    public static MonitoringDeviceDTO toMonitoringDeviceDto(MonitoredDevice device){
        return new MonitoringDeviceDTO(device.getId(), device.getMaximumHourlyConsumption(), device.getUserId());
    }

    public static MonitoredDevice toEntity(MonitoringDeviceDTO monitoringDeviceDTO){
        return new MonitoredDevice(
                monitoringDeviceDTO.getId(),
                monitoringDeviceDTO.getMaximumHourlyConsumption(),
                monitoringDeviceDTO.getUserId()
        );
    }
}
