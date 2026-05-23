package com.example.RemotePatientMonitoring.controller;

import com.example.RemotePatientMonitoring.dto.ApiResponse;
import com.example.RemotePatientMonitoring.dto.HealthDataDTO;
import com.example.RemotePatientMonitoring.service.HealthDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/health-data")
@CrossOrigin(origins = "*")
public class HealthDataController {

    @Autowired
    private HealthDataService healthDataService;

    @GetMapping("/{patientId}")
    public ResponseEntity<ApiResponse<List<HealthDataDTO>>> getHealthDataByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.success("Health data retrieved successfully", healthDataService.getHealthDataByPatient(patientId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<HealthDataDTO>> createHealthData(@Valid @RequestBody HealthDataDTO healthData) {
        return ResponseEntity.ok(ApiResponse.success("Health data added successfully", healthDataService.createHealthData(healthData)));
    }

    @PostMapping("/simulate/{patientId}")
    public ResponseEntity<ApiResponse<HealthDataDTO>> simulateHealthData(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.success("Health data simulated successfully", healthDataService.simulateHealthData(patientId)));
    }
}