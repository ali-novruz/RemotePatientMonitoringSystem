package com.example.RemotePatientMonitoring.controller;

import com.example.RemotePatientMonitoring.dto.ApiResponse;
import com.example.RemotePatientMonitoring.dto.PatientDTO;
import com.example.RemotePatientMonitoring.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(originPatterns = "*")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PatientDTO>>> getAllPatients() {
        return ResponseEntity.ok(ApiResponse.success("Patients retrieved successfully", patientService.getAllPatients()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientDTO>> getPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Patient found", patientService.getPatientById(id)));
    }
}