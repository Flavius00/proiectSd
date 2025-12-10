package com.example.demo.controllers;

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
import java.util.UUID;

@RestController
@RequestMapping("/reading")
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
}
