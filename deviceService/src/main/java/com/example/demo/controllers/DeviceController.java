package com.example.demo.controllers;

import com.example.demo.dtos.DeviceDto;
import com.example.demo.dtos.DeviceDetailsDto;
import com.example.demo.services.DeviceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RequestMapping("/devices")
@Validated
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping
    public ResponseEntity<List<DeviceDetailsDto>> getDevices() {
        return ResponseEntity.ok(deviceService.findDevices());
    }

    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody DeviceDetailsDto device) {
        UUID id = deviceService.insert(device);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();
        return ResponseEntity.created(location).build(); // 201 + Location header
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeviceDetailsDto> getDevice(@PathVariable UUID id) {
        return ResponseEntity.ok(deviceService.findDevicesById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDevice(@PathVariable UUID id) {
        deviceService.delete(id);

        return ResponseEntity.ok("Device deleted succesfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeviceDetailsDto> updateDevice(
            @PathVariable UUID id,
            @Valid @RequestBody DeviceDetailsDto device
    ) {
        device.setId(id);
        deviceService.update(device);

        return ResponseEntity.ok(deviceService.findDevicesById(id));
    }
}
