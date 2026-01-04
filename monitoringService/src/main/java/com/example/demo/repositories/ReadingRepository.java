package com.example.demo.repositories;

import com.example.demo.entities.Reading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

import java.util.Optional;
import java.util.UUID;

public interface ReadingRepository extends JpaRepository<Reading, UUID> {
    Optional<Reading> findByDeviceIdAndTimeStamp(UUID id, long hourlyTimestamp);

    @Query("SELECT r FROM Reading r WHERE r.deviceId = :deviceId AND r.timeStamp >= :startTime AND r.timeStamp < :endTime")
    List<Reading> findByDeviceIdAndDate(
            @Param("deviceId") UUID deviceId,
            @Param("startTime") Long startTime,
            @Param("endTime") Long endTime
    );
}
