package com.example.demo.services;


import com.example.demo.dtos.DeviceChartDataDTO;
import com.example.demo.dtos.NotificationDTO;
import com.example.demo.dtos.ReadingDTO;
import com.example.demo.dtos.ReadingDetailsDTO;
import com.example.demo.dtos.builders.ReadingBuilder;
import com.example.demo.entities.MonitoredDevice;
import com.example.demo.entities.Reading;
import com.example.demo.handlers.exceptions.model.ResourceNotFoundException;
import com.example.demo.repositories.MonitoredDeviceReository;
import com.example.demo.repositories.ReadingRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReadingService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ReadingService.class);
    private final ReadingRepository readingRepository;
    private final MonitoredDeviceReository deviceRepository;
    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public ReadingService(ReadingRepository readingRepository, MonitoredDeviceReository deviceReository, RabbitTemplate rabbitTemplate) {
        this.readingRepository = readingRepository;
        this.deviceRepository = deviceReository;
        this.rabbitTemplate = rabbitTemplate;
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

    public List<ReadingDTO> getReadingsForChart(UUID deviceId, long dateStart, long dateEnd) {
        return readingRepository.findByDeviceIdAndDate(deviceId, dateStart, dateEnd)
                .stream()
                .map(ReadingBuilder::toReadingDTO)
                .collect(Collectors.toList());
    }

    public List<DeviceChartDataDTO> getReadingsForUserChart(UUID userId, long start, long end) {
        // 1. Găsim dispozitivele din baza de date locală a Monitoring Service
        List<MonitoredDevice> devices = deviceRepository.findByUserId(userId);
        List<DeviceChartDataDTO> result = new ArrayList<>();

        for (MonitoredDevice device : devices) {
            // 2. Pentru fiecare dispozitiv, luăm citirile din interval
            List<ReadingDTO> readings = readingRepository.findByDeviceIdAndDate(device.getId(), start, end)
                    .stream()
                    .map(ReadingBuilder::toReadingDTO)
                    .collect(Collectors.toList());

            // 3. Construim obiectul complet folosind datele din monitored_device
            result.add(new DeviceChartDataDTO(
                    device.getId(),
                    device.getName(),
                    device.getMaximumConsumption(),
                    readings
            ));
        }
        return result;
    }

    @Transactional
    public void processReading(ReadingDTO readingDTO) {
        // 1. Verificăm dacă dispozitivul există în baza noastră locală
        Optional<MonitoredDevice> deviceOpt = deviceRepository.findById(readingDTO.getDeviceId());

        if (deviceOpt.isEmpty()) {
            System.err.println("Eroare: Am primit date pentru un dispozitiv necunoscut (ne-sincronizat): " + readingDTO.getDeviceId());
            return;
        }

        MonitoredDevice device = deviceOpt.get();

        // 2. Calculăm timestamp-ul pentru "ora fixă" (ex: 10:45 -> 10:00)
        // Astfel grupăm toate citirile din acea oră într-o singură înregistrare (sau le adunăm dinamic)
        long currentTimestamp = readingDTO.getTimeStamp();
        long hourlyTimestamp = truncateToHour(currentTimestamp);

        // 3. Căutăm dacă există deja o înregistrare pentru acest dispozitiv la această oră
        // (Trebuie să ai o metodă în repo: findByDeviceIdAndTimestamp)
        Optional<Reading> existingReading = readingRepository.findByDeviceIdAndTimeStamp(device.getId(), hourlyTimestamp);

        Reading reading;
        if (existingReading.isPresent()) {
            // Dacă există, adunăm valoarea nouă la cea existentă (consum cumulat pe oră)
            reading = existingReading.get();
            reading.setReading(reading.getReading() + readingDTO.getReading());
        } else {
            // Dacă nu, creăm o înregistrare nouă pentru această oră
            reading = new Reading();
            reading.setTimeStamp(hourlyTimestamp);
            reading.setDeviceId(device.getId());
            reading.setReading(readingDTO.getReading());
        }

        readingRepository.save(reading);
        System.out.println("Reading salvat/actualizat pentru ora " + Instant.ofEpochMilli(hourlyTimestamp));

        // 4. Verificare limită consum (opțional, pentru viitor)
        if (reading.getReading() > device.getMaximumConsumption()) {
            System.out.println("ALERT: Overconsumption detected for device " + device.getId());

            NotificationDTO notification = new NotificationDTO(
                    "High energy consumption detected on device: " + device.getName() +
                            ". Value: " + reading.getReading() + " exceeds limit: " + device.getMaximumConsumption(),
                    device.getUserId(),
                    device.getId()
            );

            rabbitTemplate.convertAndSend("notification-queue", notification);
        }
    }

    // Metodă ajutătoare pentru a tăia minutele și secundele
    private long truncateToHour(long timestampMillis) {
        return Instant.ofEpochMilli(timestampMillis)
                .truncatedTo(ChronoUnit.HOURS)
                .toEpochMilli();
    }

}
