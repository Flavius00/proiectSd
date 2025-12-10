package com.example.demo.repositories;

import com.example.demo.entities.Reading;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ReadingRepository extends JpaRepository<Reading, UUID> { /**/ }
