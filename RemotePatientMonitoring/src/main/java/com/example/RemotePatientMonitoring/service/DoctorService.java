package com.example.RemotePatientMonitoring.service;

import com.example.RemotePatientMonitoring.dto.DoctorDTO;
import com.example.RemotePatientMonitoring.dto.PatientDTO;
import com.example.RemotePatientMonitoring.model.Doctor;
import com.example.RemotePatientMonitoring.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PatientDTO> getPatientsByDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found: " + id));
        
        return doctor.getPatients().stream().map(patient -> {
            PatientDTO dto = new PatientDTO();
            dto.setId(patient.getId());
            dto.setFirstName(patient.getFirstName());
            dto.setLastName(patient.getLastName());
            dto.setEmail(patient.getEmail());
            dto.setCreatedAt(patient.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());
    }

    private DoctorDTO convertToDTO(Doctor doctor) {
        DoctorDTO dto = new DoctorDTO();
        dto.setId(doctor.getId());
        dto.setFirstName(doctor.getFirstName());
        dto.setLastName(doctor.getLastName());
        dto.setEmail(doctor.getEmail());
        
        if (doctor.getPatients() != null) {
            List<PatientDTO> patientDTOs = doctor.getPatients().stream().map(patient -> {
                PatientDTO pDto = new PatientDTO();
                pDto.setId(patient.getId());
                pDto.setFirstName(patient.getFirstName());
                pDto.setLastName(patient.getLastName());
                pDto.setEmail(patient.getEmail());
                pDto.setCreatedAt(patient.getCreatedAt());
                return pDto;
            }).collect(Collectors.toList());
            dto.setPatients(patientDTOs);
        }
        
        return dto;
    }
}
