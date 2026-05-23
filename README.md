# Remote Patient Monitoring System (RPMS) - Remastered

![RPMS Banner](https://via.placeholder.com/1200x400.png?text=Remote+Patient+Monitoring+System)

> A modern, robust, and full-stack Remote Patient Monitoring System rebuilt with clean architecture, elegant UI, and scalable design patterns.

## 🌟 Overview

The **Remote Patient Monitoring System** is designed to track patient health data (Heart Rate, Blood Sugar, Blood Pressure) in real-time. It connects doctors with their patients, providing dynamic analytics, notifications for abnormal health conditions, and real-time dashboard visualizations.

This project uses a **Spring Boot 3** backend with a layered, modular architecture, and a **Vanilla JavaScript** frontend enriched with Bootstrap 5 and Chart.js for a premium user experience.

## ✨ Features

- **👨‍⚕️ Doctor Dashboard:** View registered doctors and the patients they are monitoring.
- **❤️ Patient Health Tracking:** Track vital signs (Heart rate, Blood sugar, Blood pressure).
- **📊 Interactive Charts:** Visualize health trends dynamically with `Chart.js`.
- **🔔 Abnormal Vitals Alerting:** Automatic simulated alerts for out-of-range metrics.
- **🌓 Dark/Light Mode:** Full system theme support, preserved across sessions.
- **🔒 API Wrapper Pattern:** A unified generic `ApiResponse<T>` envelope for all API endpoints.
- **🛡️ Global Exception Handling:** Robust validation and error processing on the backend.

## 🛠️ Tech Stack

### Backend
- **Java 17+**
- **Spring Boot 3.4.3**
- **Spring Web / Spring Data JPA**
- **H2 In-Memory Database** (for quick bootstrapping)
- **Lombok** (Boilerplate reduction)
- **Jakarta Validation API**

### Frontend
- **HTML5 / CSS3 / JavaScript (ES6 Modules)**
- **Bootstrap 5.3**
- **Bootstrap Icons**
- **Chart.js**

---

## 🚀 Getting Started

### Prerequisites
- JDK 17 or higher (`JAVA_HOME` configured)
- Node.js & npm (optional, for advanced frontend tooling if needed)
- A modern web browser

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/remote-patient-monitoring.git
   cd remote-patient-monitoring/RemotePatientMonitoring
   ```

2. **Run the backend using Maven wrapper:**
   ```bash
   ./mvnw spring-boot:run
   ```
   > The application will run on `http://localhost:8080`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../patient-monitoring-frontend
   ```

2. Open the `index.html` file in your browser, or start a simple local server:
   ```bash
   npx serve .
   ```
   > By default, the frontend connects to `http://localhost:8080`. Ensure the backend is running.

---

## 📚 API Endpoints

All responses are wrapped in the standard `ApiResponse` envelope:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/doctors` | Get all registered doctors. |
| `GET` | `/api/doctors/{id}/patients` | Get patients monitored by a specific doctor. |
| `GET` | `/api/patients` | Get all patients. |
| `GET` | `/api/patients/{id}` | Get a specific patient by ID. |
| `GET` | `/api/health-data/{patientId}` | Get historical health data for a patient. |
| `POST` | `/api/health-data` | Add new health metrics manually. |
| `POST` | `/api/health-data/simulate/{patientId}` | Auto-generate test health metrics. |

---

## 🎨 UI/UX Design

The application implements a premium "Glassmorphism" aesthetic with vibrant gradients and subtle CSS micro-animations. It's responsive out of the box and features an accessible, high-contrast Dark Mode toggle.

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
