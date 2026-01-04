package com.example.demo.services;

import com.example.demo.dtos.MonitoringDeviceDTO;
import com.example.demo.entities.MonitoredDevice;
import com.example.demo.repositories.MonitoredDeviceReository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class DeviceService {

    private final MonitoredDeviceReository deviceRepository;

    public DeviceService(MonitoredDeviceReository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @Transactional
    public void syncDevice(MonitoringDeviceDTO deviceDTO) {
        Optional<MonitoredDevice> existingDeviceOpt = deviceRepository.findById(deviceDTO.getId());

        MonitoredDevice device;
        if (existingDeviceOpt.isPresent()) {
            device = existingDeviceOpt.get();
            device.setMaximumConsumption(deviceDTO.getMaximumConsumption());
            device.setName(deviceDTO.getName());
            device.setUserId(deviceDTO.getUserId());
        } else {
            device = new MonitoredDevice();
            device.setId(deviceDTO.getId());
            device.setName(deviceDTO.getName());
            device.setMaximumConsumption(deviceDTO.getMaximumConsumption());
            device.setUserId(deviceDTO.getUserId());
        }

        deviceRepository.save(device);
        System.out.println("Dispozitiv sincronizat: " + device.getId());
    }

    public void delete(UUID deviceId) {
        // Opțional: Șterge citirile asociate (dacă nu ai CascadeType setat în Entity)
        // readingRepository.deleteByDeviceId(deviceId);

        // Șterge dispozitivul monitorizat
        // Dacă ID-ul nu există, deleteById de obicei aruncă eroare sau ignoră,
        // putem verifica existența înainte dacă dorim.
        if(deviceRepository.existsById(deviceId)){
            deviceRepository.deleteById(deviceId);
            System.out.println("Monitored Device deleted: " + deviceId);
        } else {
            System.out.println("Device not found for deletion: " + deviceId);
        }
    }
}