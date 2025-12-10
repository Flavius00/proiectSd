package com.example.demo.services;


import com.example.demo.dtos.ReadingDTO;
import com.example.demo.dtos.ReadingDetailsDTO;
import com.example.demo.dtos.builders.ReadingBuilder;
import com.example.demo.entities.Reading;
import com.example.demo.handlers.exceptions.model.ResourceNotFoundException;
import com.example.demo.repositories.ReadingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReadingService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ReadingService.class);
    private final ReadingRepository readingRepository;

    @Autowired
    public ReadingService(ReadingRepository readingRepository) {
        this.readingRepository = readingRepository;
    }

    public List<ReadingDTO> findReading() {
        List<Reading> readingList = readingRepository.findAll();
        return readingList.stream()
                .map(ReadingBuilder::toReadingDTO)
                .collect(Collectors.toList());
    }

    public ReadingDetailsDTO findReadingById(UUID id) {
        Optional<Reading> prosumerOptional = readingRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("Reading with id {} was not found in db", id);
            throw new ResourceNotFoundException(Reading.class.getSimpleName() + " with id: " + id);
        }
        return ReadingBuilder.toReadingDetailsDTO(prosumerOptional.get());
    }

    public UUID insert(ReadingDetailsDTO readingDto) {
        Reading reading = ReadingBuilder.toEntity(readingDto);
        reading = readingRepository.save(reading);
        LOGGER.debug("Reading with id {} was inserted in db", reading.getId());
        return reading.getId();
    }

}
