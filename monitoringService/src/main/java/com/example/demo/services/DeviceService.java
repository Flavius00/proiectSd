package com.example.demo.services;

import com.example.demo.dtos.MonitoringDeviceDTO;
import com.example.demo.entities.MonitoredDevice;
import com.example.demo.repositories.MonitoredDeviceReository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DeviceService {

    private final MonitoredDeviceReository deviceRepository;

    public DeviceService(MonitoredDeviceReository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @Transactional
    public void syncDevice(MonitoringDeviceDTO deviceDTO) {
        // Căutăm dispozitivul local după ID-ul primit
        Optional<MonitoredDevice> existingDeviceOpt = deviceRepository.findById(deviceDTO.getId());

        MonitoredDevice device;
        if (existingDeviceOpt.isPresent()) {
            device = existingDeviceOpt.get();
            device.setMaximumHourlyConsumption(deviceDTO.getMaximumHourlyConsumption());
            device.setUserId(deviceDTO.getUserId());
        } else {
            device = new MonitoredDevice();
            device.setId(deviceDTO.getId());
            device.setMaximumHourlyConsumption(deviceDTO.getMaximumHourlyConsumption());
            device.setUserId(deviceDTO.getUserId());
        }

        deviceRepository.save(device);
        System.out.println("Dispozitiv sincronizat: " + device.getId());
    }
}