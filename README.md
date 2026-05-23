# Remote Patient Monitoring System 🩺 (Remastered Edition)

*A modern, premium solution for remote patient monitoring with Glassmorphic UI and Smart Data Seeding.*

---

## 📖 Overview

The **Remote Patient Monitoring System** is a state-of-the-art web application designed to monitor patients' health data (heart rate, blood sugar, blood pressure) remotely and in real-time. This system enables doctors to track their patients' health metrics, integrates with Fitbit devices to provide comprehensive health analysis, and generates automatic notifications for abnormal health data.

**What's new in the Remastered Edition?** 🚀
- **Premium Glassmorphic UI:** A complete frontend overhaul featuring custom CSS glassmorphism, responsive sidebar layout, smooth micro-animations, and dynamic Chart.js gradients.
- **Smart Data Seeder:** Automatically populates the database with sample doctors, patients, and realistic health records on first startup. No manual data entry required!
- **Fitbit Live Stream Simulator:** Don't have a Fitbit developer account? No problem! Use the built-in simulator mode to stream 60 minutes of mock physiological data (with moving averages and anomaly alerts) directly to your dashboard.
- **Multi-user Fitbit Token Architecture:** Fitbit Access Tokens are now securely associated with individual patients in the database, allowing multiple patients to connect their unique devices flawlessly.
- **Global API Error Handling:** Improved backend architecture with a `@RestControllerAdvice` for clean JSON error responses.

This project is built using **Java Spring Boot 3** (backend), **JavaScript/HTML/CSS** (frontend), and **PostgreSQL** (database).

---

## ✨ Key Features

- **Real-Time Health Data Monitoring:** Visualize heart rate, blood sugar, and blood pressure data with beautifully animated interactive charts.
- **Fitbit Integration & Simulation:** Retrieve and analyze heart rate data from real Fitbit devices or run the built-in Live Stream Simulator.
- **Abnormal Data Detection:** Automatically generate alerts and warning cards when heart rate exceeds 100 bpm or blood sugar exceeds 120 mg/dL.
- **Multi-User Architecture:** Support for multiple doctors managing multiple patients securely.
- **Dark/Light Theme Support:** Toggle between highly optimized Light and Dark modes with curated HSL color palettes.

---

## 🛠️ Tech Stack

- **Backend:** Java 17, Spring Boot 3, Spring Data JPA, Spring Security
- **Frontend:** HTML5, CSS3 (Vanilla + Glassmorphism), Vanilla JavaScript
- **Database:** PostgreSQL
- **Charting Library:** Chart.js 3
- **Icons & Typography:** Bootstrap Icons, Google Outfit Font
- **Integrations:** Fitbit OAuth2 API

---

## 📦 Installation

Follow the steps below to set up and run the remastered project on your local machine.

### Prerequisites
- **Java 17+** (required for Spring Boot)
- **Node.js** (optional, for running the frontend with Live Server)
- **PostgreSQL** (for the database)

### Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/ali-novruz/RemotePatientMonitoringSystem.git
   cd RemotePatientMonitoringSystem
   ```

2. **Set Up the Database:**
   Create a PostgreSQL database:
   ```sql
   CREATE DATABASE remote_patient_monitoring;
   ```
   Update the `application.properties` file (`RemotePatientMonitoring/src/main/resources/application.properties`) with your database connection details:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/remote_patient_monitoring
   spring.datasource.username=your-username
   spring.datasource.password=your-password
   ```

3. **Run the Backend:**
   - Open the backend directory (`RemotePatientMonitoring`) in your IDE (IntelliJ IDEA, Eclipse, etc.).
   - Run the application.
   - The **DataSeeder** will automatically detect an empty database and insert sample Doctors, Patients, and simulated health history.
   - The backend will start on `http://localhost:8080`.

4. **Run the Frontend:**
   - Open the frontend directory (`patient-monitoring-frontend/index.html`) in VS Code.
   - Use the Live Server extension to run the file (`Go Live`).
   - The frontend will start on `http://127.0.0.1:5500` by default.

5. **(Optional) Configure Real Fitbit API Integration:**
   - Create an application on the Fitbit Developer Portal and obtain your `client_id` and `client_secret`.
   - Add the Fitbit API credentials to the `application.properties` file:
   ```properties
   fitbit.client-id=your-client-id
   fitbit.client-secret=your-client-secret
   fitbit.redirect-uri=http://localhost:8080/api/fitbit/callback
   ```
   *Note: If you skip this, you can still use the new "Simülasyon Modu" (Simulator Mode) from the frontend!*

---

## 🚀 Usage

### Log In:
- Open the application and log in using the default credentials:  
  **Username:** `user`  
  **Password:** `password123`

### Use the Patient Panel:
- Navigate to the **Hasta Paneli** (Patient Tab).
- Select a patient from the dropdown (automatically populated by the Data Seeder).
- View health data in interactive gradients.
- Click **"Yeni Veri Simüle Et"** to generate an instant mock health record.

### Fitbit Demonstration:
- Open the **Fitbit** dropdown on the top right.
- Click **"Simülasyon Modu Başlat"** to visualize real-time moving averages and sudden heart rate anomaly detection without a device!

### Use the Doctor Panel:
- Navigate to the **Doktor Paneli** (Doctor Tab) to view the beautifully formatted list of doctors and their associated patients.

---

## 🤝 Contributing

Contributions are welcome! To contribute to this project, please follow these steps:

1. Fork this repository.
2. Create a new branch:  
   ```bash
   git checkout -b feature/your-feature
   ```
3. Make your changes and commit them:  
   ```bash
   git commit -m "Added your feature"
   ```
4. Push your branch:  
   ```bash
   git push origin feature/your-feature
   ```
5. Open a Pull Request.

---

## 📜 License

This project is licensed under the **MIT License**. See the `LICENSE` file for more details.

---

## 📧 Contact

- **Email:** alinovruz29@gmail.com  
- **GitHub:** [Ali Novruz](https://github.com/ali-novruz)

---

## 🙏 Acknowledgments

- **Fitbit API** for providing health data integration.
- **Chart.js** for the interactive charting library.

⭐ If you like this project, please give it a star!
