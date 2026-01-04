package com.example.demo.repositories;

import com.example.demo.entities.UserSync;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface UserSyncRepository extends JpaRepository<UserSync, UUID> {
}