package com.example.RemotePatientMonitoring.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;

public class HealthDataDTO {
    private Long id;

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    @Min(value = 0, message = "Heart rate cannot be less than 0")
    private Integer heartRate;

    @Min(value = 0, message = "Blood sugar cannot be less than 0")
    private Integer bloodSugar;

    private String bloodPressure;
    private LocalDateTime recordedAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public Integer getHeartRate() { return heartRate; }
    public void setHeartRate(Integer heartRate) { this.heartRate = heartRate; }
    public Integer getBloodSugar() { return bloodSugar; }
    public void setBloodSugar(Integer bloodSugar) { this.bloodSugar = bloodSugar; }
    public String getBloodPressure() { return bloodPressure; }
    public void setBloodPressure(String bloodPressure) { this.bloodPressure = bloodPressure; }
    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}