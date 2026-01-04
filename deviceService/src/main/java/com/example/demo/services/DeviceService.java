package com.example.demo.services;


import com.example.demo.dtos.DeviceDto;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import com.example.demo.dtos.DeviceDetailsDto;
import com.example.demo.dtos.builders.DeviceBuilder;
import com.example.demo.entities.Device;
import com.example.demo.handlers.exceptions.model.ResourceNotFoundException;
import com.example.demo.repositories.DeviceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DeviceService {
    private static final Logger LOGGER = LoggerFactory.getLogger(DeviceService.class);
    private final DeviceRepository deviceRepository;
    private final RabbitTemplate rabbitTemplate;


    @Autowired
    public DeviceService(DeviceRepository deviceRepository, RabbitTemplate rabbitTemplate) {
        this.deviceRepository = deviceRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    public List<DeviceDetailsDto> findDevices() {
        List<Device> deviceList = deviceRepository.findAll();
        return deviceList.stream()
                .map(DeviceBuilder::toDeviceDetailsDTO)
                .collect(Collectors.toList());
    }

    public DeviceDetailsDto findDevicesById(UUID id) {
        Optional<Device> prosumerOptional = deviceRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("Device with id {} was not found in db", id);
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + id);
        }
        return DeviceBuilder.toDeviceDetailsDTO(prosumerOptional.get());
    }

    public UUID insert(DeviceDetailsDto deviceDto) {
        Device device = DeviceBuilder.toEntity(deviceDto);
        device = deviceRepository.save(device);

        // --- COD NOU SINCRONIZARE ---
        // Construim mesajul pentru Monitoring (trebuie sa aiba campurile: id, maximumHourlyConsumption, userId)
        // Poti folosi un Map sau un DTO dedicat. Aici folosim un DTO simplu 'on the fly' sau DeviceDetailsDto daca se potriveste.
        // Pentru siguranta, MonitoringService asteapta MonitoringDeviceDTO.
        // Asigura-te ca trimiti JSON. Spring face asta automat daca trimiti un obiect.

        DeviceDetailsDto syncData = new DeviceDetailsDto(
                device.getId(),
                device.getName(),
                device.getMaximumConsumption(),
                device.getUserId()
        );

        rabbitTemplate.convertAndSend("device-sync-queue", syncData);
        LOGGER.debug("Sent sync message for device id: {}", device.getId());
        // ----------------------------

        return device.getId();
    }

    public UUID update(DeviceDetailsDto deviceDto) {
        Device device = DeviceBuilder.toEntity(deviceDto);
        device = deviceRepository.save(device);
        LOGGER.debug("Device with id {} was updated in db", device.getId());
        return device.getId();
    }

    public void delete(UUID id) {
        deviceRepository.deleteById(id);
    }

}
