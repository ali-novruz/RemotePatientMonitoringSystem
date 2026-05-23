package com.example.RemotePatientMonitoring.service;

import com.example.RemotePatientMonitoring.model.Doctor;
import com.example.RemotePatientMonitoring.model.HealthData;
import com.example.RemotePatientMonitoring.model.Patient;
import com.example.RemotePatientMonitoring.repository.DoctorRepository;
import com.example.RemotePatientMonitoring.repository.HealthDataRepository;
import com.example.RemotePatientMonitoring.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private HealthDataRepository healthDataRepository;

    @Override
    public void run(String... args) throws Exception {
        if (patientRepository.count() == 0) {
            // Seed Patients
            Patient p1 = createPatient("Ahmet", "Yılmaz", "ahmet@example.com");
            Patient p2 = createPatient("Elif", "Demir", "elif@example.com");
            Patient p3 = createPatient("Can", "Koç", "can@example.com");
            Patient p4 = createPatient("Zeynep", "Kaya", "zeynep@example.com");
            Patient p5 = createPatient("Murat", "Şahin", "murat@example.com");

            patientRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5));

            // Seed Doctors
            Doctor d1 = createDoctor("Dr. Aylin", "Yılmaz", "aylin@hospital.com", Arrays.asList(p1, p2, p3));
            Doctor d2 = createDoctor("Dr. Burak", "Kaya", "burak@hospital.com", Arrays.asList(p4, p5));

            doctorRepository.saveAll(Arrays.asList(d1, d2));

            // Seed Health Data
            seedHealthData(p1);
            seedHealthData(p2);
            seedHealthData(p3);
            seedHealthData(p4);
            seedHealthData(p5);

            System.out.println("Veritabanı başlangıç verileri (Data Seeder) başarıyla eklendi.");
        }
    }

    private Patient createPatient(String firstName, String lastName, String email) {
        Patient patient = new Patient();
        patient.setFirstName(firstName);
        patient.setLastName(lastName);
        patient.setEmail(email);
        patient.setCreatedAt(LocalDateTime.now());
        return patient;
    }

    private Doctor createDoctor(String firstName, String lastName, String email, List<Patient> patients) {
        Doctor doctor = new Doctor();
        doctor.setFirstName(firstName);
        doctor.setLastName(lastName);
        doctor.setEmail(email);
        doctor.setCreatedAt(LocalDateTime.now());
        doctor.setPatients(patients);
        return doctor;
    }

    private void seedHealthData(Patient patient) {
        for (int i = 0; i < 5; i++) {
            HealthData healthData = new HealthData();
            healthData.setPatientId(patient.getId());
            healthData.setHeartRate(70 + (int)(Math.random() * 20)); // 70-90 bpm
            healthData.setBloodPressure("120/80");
            healthData.setBloodSugar(90 + (int)(Math.random() * 20)); // 90-110 mg/dL
            healthData.setRecordedAt(LocalDateTime.now().minusHours(4 - i));
            healthDataRepository.save(healthData);
        }
    }
}
