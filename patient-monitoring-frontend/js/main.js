// js/main.js - Application entry point
import { Api } from './api.js';
import { UI } from './ui.js';
import { login, logout } from './auth.js';

// Expose to window for inline event handlers in HTML
window.login = login;
window.logout = logout;
window.showTab = showTab;
window.loadHealthData = loadHealthData;
window.simulateHealthData = simulateHealthData;
window.connectToFitbit = connectToFitbit;
window.simulateFitbitStream = simulateFitbitStream;

document.addEventListener('DOMContentLoaded', () => {
    UI.updateDate();
    
    const loginScreen = document.getElementById('loginScreen');
    if (loginScreen) loginScreen.style.display = 'flex';

    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            UI.toggleTheme();
            loadHealthData(); // refresh charts
        });
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="bi bi-sun-fill me-2"></i> Light Mode';
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('fitbitConnected') === 'true') {
        UI.showNotification('Fitbit device connected successfully!', 'success');
    }
});

export function showTab(tabId) {
    UI.showTab(tabId);
    if (tabId === 'patientTab') loadPatients();
    else if (tabId === 'doctorTab') loadDoctors();
}

export async function loadPatients() {
    try {
        const patients = await Api.getPatients();
        const select = document.getElementById('patientSelect');
        if (!select) return;
        
        select.innerHTML = '';
        
        patients.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = `${p.firstName} ${p.lastName}`;
            select.appendChild(opt);
        });

        if (patients.length > 0) loadHealthData();
    } catch (e) {
        UI.showNotification('Failed to load patients: ' + e.message, 'danger');
    }
}

export async function loadDoctors() {
    try {
        const doctors = await Api.getDoctors();
        const tbody = document.querySelector('#doctorTable tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        doctors.forEach(d => {
            const patientsList = (d.patients || []).map(p => `<span class="badge bg-secondary me-1">${p.firstName} ${p.lastName}</span>`).join('');
            tbody.innerHTML += `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3" style="width:40px;height:40px;">
                                ${(d.firstName || ' ').charAt(0)}${(d.lastName || ' ').charAt(0)}
                            </div>
                            <span class="fw-medium">${d.firstName} ${d.lastName}</span>
                        </div>
                    </td>
                    <td>${d.email}</td>
                    <td>${patientsList || '<span class="text-muted">No Patients</span>'}</td>
                    <td><button class="btn btn-sm btn-outline-primary rounded-pill px-3">Contact</button></td>
                </tr>
            `;
        });
    } catch (e) {
        UI.showNotification('Failed to load doctors: ' + e.message, 'danger');
    }
}

export async function loadHealthData() {
    const patientSelect = document.getElementById('patientSelect');
    if (!patientSelect) return;
    const patientId = patientSelect.value;
    if (!patientId) return;

    try {
        const data = await Api.getHealthData(patientId);
        UI.updateChartsAndSummary(data);
    } catch (e) {
        UI.showNotification('Failed to load health data', 'danger');
    }
}

export async function simulateHealthData() {
    const patientSelect = document.getElementById('patientSelect');
    if (!patientSelect) return;
    const patientId = patientSelect.value;
    if (!patientId) return;

    try {
        await Api.simulateHealthData(patientId);
        loadHealthData();
        UI.showNotification('New health data simulated successfully.', 'success');
    } catch (e) {
        UI.showNotification('Simulation failed', 'danger');
    }
}

export async function connectToFitbit() {
    const patientSelect = document.getElementById('patientSelect');
    if (!patientSelect) return;
    const patientId = patientSelect.value;
    if (!patientId) return;
    
    try {
        const url = await Api.authorizeFitbit(patientId);
        window.location.href = url;
    } catch (e) {
        UI.showNotification('Fitbit connection error: ' + e.message, 'danger');
    }
}

export async function simulateFitbitStream() {
    try {
        UI.showNotification('Starting Fitbit live stream simulation...', 'info');
        const fitbitData = await Api.simulateFitbitStream();
        
        const dataset = fitbitData['activities-heart-intraday'].dataset;
        const labels = dataset.map(d => d.time);
        const hrData = dataset.map(d => d.value);
        
        const analysis = fitbitData.analysis;
        if (analysis && analysis.alerts && analysis.alerts.length > 0) {
            analysis.alerts.forEach(alert => UI.showNotification(alert, 'warning'));
        }

        UI.renderChart('heartRateChart', 'Fitbit Heart Rate (Sim)', labels, hrData, 'rgba(16, 185, 129, 1)', 'rgba(16, 185, 129, 0.2)');
        
        const bsData = hrData.map(v => 95 + (v % 10));
        UI.renderChart('bloodSugarChart', 'Blood Sugar (Sim)', labels, bsData, 'rgba(14, 165, 233, 1)', 'rgba(14, 165, 233, 0.2)');
        
    } catch (e) {
        UI.showNotification('Failed to get simulation stream.', 'danger');
    }
}
