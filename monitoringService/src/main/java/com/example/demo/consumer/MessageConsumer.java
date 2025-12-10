package com.example.demo.communication;

import com.example.demo.dtos.ReadingDTO;
import com.example.demo.dtos.MonitoringDeviceDTO;
import com.example.demo.services.DeviceService;
import com.example.demo.services.ReadingService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class MessageConsumer {

    private final ReadingService readingService;
    private final DeviceService deviceService;

    public MessageConsumer(ReadingService readingService, DeviceService deviceService) {
        this.readingService = readingService;
        this.deviceService = deviceService;
    }

    @RabbitListener(queues = "energy-queue")
    public void consumeEnergyMessage(ReadingDTO readingDTO) {
        System.out.println("Received energy data: " + readingDTO);
        readingService.processReading(readingDTO);
    }

    @RabbitListener(queues = "device-sync-queue")
    public void consumeSyncMessage(MonitoringDeviceDTO deviceDTO) {
        System.out.println("Received sync data: " + deviceDTO);
        deviceService.syncDevice(deviceDTO);
    }
}