package com.example.demo.controllers;

import com.example.demo.dtos.DeviceChartDataDTO;
import com.example.demo.dtos.ReadingDTO;
import com.example.demo.dtos.ReadingDetailsDTO;
import com.example.demo.services.ReadingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/monitoring")
@Validated
public class ReadingController {

    private final ReadingService readingService;

    public ReadingController(ReadingService readingService) {
        this.readingService = readingService;
    }

    @GetMapping
    public ResponseEntity<List<ReadingDTO>> getReadings() {
        return ResponseEntity.ok(readingService.findReading());
    }

    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody ReadingDetailsDTO reading) {
        UUID id = readingService.insert(reading);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();
        return ResponseEntity.created(location).build(); // 201 + Location header
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReadingDetailsDTO> getReading(@PathVariable UUID id) {
        return ResponseEntity.ok(readingService.findReadingById(id));
    }

    @GetMapping("/chart/user/{userId}")
    public ResponseEntity<List<DeviceChartDataDTO>> getUserChartData(
            @PathVariable UUID userId,
            @RequestParam("date") String dateStr) {

        java.time.LocalDate date = java.time.LocalDate.parse(dateStr);
        long start = date.atStartOfDay(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli();
        long end = date.plusDays(1).atStartOfDay(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli();

        return ResponseEntity.ok(readingService.getReadingsForUserChart(userId, start, end));
    }
}
