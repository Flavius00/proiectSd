package com.example.demo.repositories;

import com.example.demo.entities.MonitoredDevice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MonitoredDeviceReository extends JpaRepository<MonitoredDevice, UUID> {
    List<MonitoredDevice> findByUserId(UUID userId);
}
