package com.example.RemotePatientMonitoring.service;

import com.example.RemotePatientMonitoring.dto.HealthDataDTO;
import com.example.RemotePatientMonitoring.model.HealthData;
import com.example.RemotePatientMonitoring.model.Notification;
import com.example.RemotePatientMonitoring.repository.HealthDataRepository;
import com.example.RemotePatientMonitoring.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HealthDataService {

    @Autowired
    private HealthDataRepository healthDataRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public List<HealthDataDTO> getHealthDataByPatient(Long patientId) {
        return healthDataRepository.findByPatientId(patientId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public HealthDataDTO createHealthData(HealthDataDTO healthDataDTO) {
        HealthData healthData = new HealthData();
        healthData.setPatientId(healthDataDTO.getPatientId());
        healthData.setHeartRate(healthDataDTO.getHeartRate());
        healthData.setBloodSugar(healthDataDTO.getBloodSugar());
        healthData.setBloodPressure(healthDataDTO.getBloodPressure());
        
        if (healthDataDTO.getRecordedAt() == null) {
            healthData.setRecordedAt(LocalDateTime.now());
        } else {
            healthData.setRecordedAt(healthDataDTO.getRecordedAt());
        }

        HealthData savedData = healthDataRepository.save(healthData);

        if ((savedData.getHeartRate() != null && savedData.getHeartRate() > 100) ||
            (savedData.getBloodSugar() != null && savedData.getBloodSugar() > 120)) {
            Notification notification = new Notification();
            notification.setPatientId(savedData.getPatientId());
            notification.setDoctorId(1L); // Şimdilik sabit bir doktor
            notification.setMessage("Warning: Abnormal health data detected! Heart Rate: " +
                    savedData.getHeartRate() + ", Blood Sugar: " + savedData.getBloodSugar());
            notificationRepository.save(notification);
        }

        return convertToDTO(savedData);
    }

    public HealthDataDTO simulateHealthData(Long patientId) {
        HealthDataDTO dto = new HealthDataDTO();
        dto.setPatientId(patientId);
        dto.setHeartRate(60 + (int)(Math.random() * 50)); // 60-110 bpm
        dto.setBloodPressure("120/80");
        dto.setBloodSugar(80 + (int)(Math.random() * 50)); // 80-130 mg/dL
        dto.setRecordedAt(LocalDateTime.now());
        
        return createHealthData(dto);
    }

    private HealthDataDTO convertToDTO(HealthData healthData) {
        HealthDataDTO dto = new HealthDataDTO();
        dto.setId(healthData.getId());
        dto.setPatientId(healthData.getPatientId());
        dto.setHeartRate(healthData.getHeartRate());
        dto.setBloodSugar(healthData.getBloodSugar());
        dto.setBloodPressure(healthData.getBloodPressure());
        dto.setRecordedAt(healthData.getRecordedAt());
        return dto;
    }
}
