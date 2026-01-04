package com.example.demo.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.util.UUID;

@Entity
public class UserSync {
    @Id
    private UUID id;

    public UserSync() {}
    public UserSync(UUID id) { this.id = id; }
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
}