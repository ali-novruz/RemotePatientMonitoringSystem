package com.example.RemotePatientMonitoring.controller;

import com.example.RemotePatientMonitoring.dto.ApiResponse;
import com.example.RemotePatientMonitoring.dto.DoctorDTO;
import com.example.RemotePatientMonitoring.dto.PatientDTO;
import com.example.RemotePatientMonitoring.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorDTO>>> getAllDoctors() {
        return ResponseEntity.ok(ApiResponse.success("Doctors retrieved successfully", doctorService.getAllDoctors()));
    }

    @GetMapping("/{id}/patients")
    public ResponseEntity<ApiResponse<List<PatientDTO>>> getPatientsByDoctor(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Patients retrieved successfully", doctorService.getPatientsByDoctor(id)));
    }
}