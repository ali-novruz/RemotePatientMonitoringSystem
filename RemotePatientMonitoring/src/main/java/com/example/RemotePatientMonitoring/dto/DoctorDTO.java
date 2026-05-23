package com.example.RemotePatientMonitoring.dto;

import java.util.List;

public class DoctorDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private List<PatientDTO> patients;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public List<PatientDTO> getPatients() { return patients; }
    public void setPatients(List<PatientDTO> patients) { this.patients = patients; }
}
