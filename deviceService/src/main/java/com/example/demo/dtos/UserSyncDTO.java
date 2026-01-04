package com.example.demo.dtos;

import java.io.Serializable;
import java.util.UUID;

public class UserSyncDTO implements Serializable {
    private UUID id;
    private String username;

    private String firstName;
    private String lastName;
    private String address;
    private int age;

    private String eventType;

    public UserSyncDTO() {}

    public UserSyncDTO(UUID id, String username, String firstName, String lastName, String address, int age, String eventType) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.age = age;
        this.eventType = eventType;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    @Override
    public String toString() {
        return "UserSyncDTO{id=" + id + ", event='" + eventType + "'}";
    }
}