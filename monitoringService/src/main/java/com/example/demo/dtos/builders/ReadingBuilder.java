package com.example.demo.dtos.builders;

import com.example.demo.dtos.ReadingDTO;
import com.example.demo.dtos.ReadingDetailsDTO;
import com.example.demo.entities.Reading;

public class ReadingBuilder {

    private ReadingBuilder() {
    }

    public static ReadingDTO toReadingDTO(Reading reading) {
        return new ReadingDTO(reading.getId(), reading.getReading(), reading.getDeviceId(), reading.getTimeStamp());
    }

    public static ReadingDetailsDTO toReadingDetailsDTO(Reading reading) {
        return new ReadingDetailsDTO(reading.getId(), reading.getDeviceName(), reading.getReading(), reading.getDeviceId(), reading.getTimeStamp());
    }

    public static Reading toEntity(ReadingDetailsDTO readingDetailsDTO) {
        return new Reading(
                readingDetailsDTO.getDeviceName(),
                readingDetailsDTO.getReading(),
                readingDetailsDTO.getDeviceId(),
                readingDetailsDTO.getTimeStamp()
        );
    }
}
