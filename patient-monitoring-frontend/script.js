// script.js - Remastered

let authCredentials = null;
let heartRateChart, bloodSugarChart;
const API_BASE = 'http://localhost:8080/api';

// Set Current Date
function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('tr-TR', options);
}

document.addEventListener('DOMContentLoaded', () => {
    updateDate();
    document.getElementById('loginScreen').style.display = 'flex';

    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleBtn.innerHTML = '<i class="bi bi-sun-fill me-2"></i> Açık Mod';
    }

    // Check for Fitbit OAuth return
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('fitbitConnected') === 'true') {
        showNotification('Fitbit cihazı başarıyla bağlandı!', 'success');
        // Normally we'd restore session from localStorage if implemented
    }
});

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');
    loginError.style.display = 'none';

    const credentials = btoa(`${username}:${password}`);
    
    try {
        const response = await fetch(`${API_BASE}/doctors`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) throw new Error('Login failed');
        
        authCredentials = credentials;
        
        // Transition to main
        const loginScreen = document.getElementById('loginScreen');
        const mainContent = document.getElementById('mainContent');
        
        loginScreen.style.opacity = '0';
        setTimeout(() => {
            loginScreen.style.display = 'none';
            mainContent.style.display = 'block';
            showTab('patientTab');
        }, 500);

    } catch (error) {
        loginError.style.display = 'block';
    }
}

function logout() {
    authCredentials = null;
    document.getElementById('mainContent').style.display = 'none';
    const loginScreen = document.getElementById('loginScreen');
    loginScreen.style.display = 'flex';
    loginScreen.style.opacity = '1';
    
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

async function fetchWithAuth(url, options = {}) {
    if (!authCredentials) throw new Error('Not authenticated');
    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Basic ${authCredentials}`,
            'X-Requested-With': 'XMLHttpRequest'
        }
    });
}

function showTab(tabId) {
    document.querySelectorAll('.tab-pane').forEach(tab => {
        tab.classList.remove('show', 'active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    const selectedTab = document.getElementById(tabId);
    selectedTab.classList.add('show', 'active');
    
    // Set active link
    const linkTarget = tabId === 'patientTab' ? 0 : 1;
    document.querySelectorAll('.nav-link')[linkTarget].classList.add('active');

    if (tabId === 'patientTab') loadPatients();
    else if (tabId === 'doctorTab') loadDoctors();
}

async function loadPatients() {
    try {
        const response = await fetchWithAuth(`${API_BASE}/patients`);
        const patients = await response.json();
        const select = document.getElementById('patientSelect');
        select.innerHTML = '';
        
        patients.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = `${p.firstName} ${p.lastName}`;
            select.appendChild(opt);
        });

        if (patients.length > 0) loadHealthData();
    } catch (e) {
        showNotification('Hastalar yüklenemedi: ' + e.message, 'danger');
    }
}

async function loadDoctors() {
    try {
        const response = await fetchWithAuth(`${API_BASE}/doctors`);
        const doctors = await response.json();
        const tbody = document.querySelector('#doctorTable tbody');
        tbody.innerHTML = '';

        doctors.forEach(d => {
            const patientsList = d.patients.map(p => `<span class="badge bg-secondary me-1">${p.firstName} ${p.lastName}</span>`).join('');
            tbody.innerHTML += `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3" style="width:40px;height:40px;">
                                ${d.firstName.charAt(0)}${d.lastName.charAt(0)}
                            </div>
                            <span class="fw-medium">${d.firstName} ${d.lastName}</span>
                        </div>
                    </td>
                    <td>${d.email}</td>
                    <td>${patientsList || '<span class="text-muted">Hasta Yok</span>'}</td>
                    <td><button class="btn btn-sm btn-outline-primary rounded-pill px-3">İletişime Geç</button></td>
                </tr>
            `;
        });
    } catch (e) {
        showNotification('Doktorlar yüklenemedi: ' + e.message, 'danger');
    }
}

async function loadHealthData() {
    const patientId = document.getElementById('patientSelect').value;
    if (!patientId) return;

    try {
        const response = await fetchWithAuth(`${API_BASE}/health-data/${patientId}`);
        const data = await response.json();
        updateChartsAndSummary(data);
    } catch (e) {
        showNotification('Sağlık verileri yüklenemedi', 'danger');
    }
}

function updateChartsAndSummary(healthData) {
    if (!healthData || healthData.length === 0) {
        document.getElementById('summaryHeartRate').innerHTML = '-- <span class="fs-6 text-muted fw-normal">bpm</span>';
        document.getElementById('summaryBloodSugar').innerHTML = '-- <span class="fs-6 text-muted fw-normal">mg/dL</span>';
        document.getElementById('summaryBloodPressure').innerHTML = '--/--';
        return;
    }

    const latest = healthData[healthData.length - 1];
    document.getElementById('summaryHeartRate').innerHTML = `${latest.heartRate} <span class="fs-6 text-muted fw-normal">bpm</span>`;
    document.getElementById('summaryBloodSugar').innerHTML = `${latest.bloodSugar} <span class="fs-6 text-muted fw-normal">mg/dL</span>`;
    document.getElementById('summaryBloodPressure').innerHTML = latest.bloodPressure || '--/--';

    const labels = healthData.map(d => new Date(d.recordedAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
    const hrData = healthData.map(d => d.heartRate);
    const bsData = healthData.map(d => d.bloodSugar);

    renderChart('heartRateChart', 'Nabız (bpm)', labels, hrData, 'rgba(239, 68, 68, 1)', 'rgba(239, 68, 68, 0.2)');
    renderChart('bloodSugarChart', 'Kan Şekeri', labels, bsData, 'rgba(14, 165, 233, 1)', 'rgba(14, 165, 233, 0.2)');
}

function renderChart(canvasId, label, labels, data, borderColor, bgColor) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Create subtle gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, bgColor);
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    const isDark = document.body.classList.contains('dark-mode');
    const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    if (canvasId === 'heartRateChart' && heartRateChart) heartRateChart.destroy();
    if (canvasId === 'bloodSugarChart' && bloodSugarChart) bloodSugarChart.destroy();

    const chartConfig = {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label,
                data,
                borderColor,
                backgroundColor: gradient,
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: borderColor,
                pointBorderColor: isDark ? '#1e293b' : '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: isDark ? '#0f172a' : '#fff',
                    titleColor: isDark ? '#fff' : '#0f172a',
                    bodyColor: isDark ? '#cbd5e1' : '#475569',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: (ctx) => `${ctx.parsed.y} ${canvasId === 'heartRateChart' ? 'bpm' : 'mg/dL'}`
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: textColor, font: { family: 'Outfit' } }
                },
                y: {
                    grid: { color: gridColor },
                    ticks: { color: textColor, font: { family: 'Outfit' } },
                    border: { display: false }
                }
            }
        }
    };

    if (canvasId === 'heartRateChart') heartRateChart = new Chart(ctx, chartConfig);
    if (canvasId === 'bloodSugarChart') bloodSugarChart = new Chart(ctx, chartConfig);
}

async function simulateHealthData() {
    const patientId = document.getElementById('patientSelect').value;
    if (!patientId) return;

    try {
        await fetchWithAuth(`${API_BASE}/health-data/simulate/${patientId}`, { method: 'POST' });
        loadHealthData();
        showNotification('Yeni sağlık verisi başarıyla simüle edildi.', 'success');
    } catch (e) {
        showNotification('Simülasyon başarısız', 'danger');
    }
}

async function connectToFitbit() {
    const patientId = document.getElementById('patientSelect').value;
    if (!patientId) return;
    
    try {
        const response = await fetchWithAuth(`${API_BASE}/fitbit/authorize?patientId=${patientId}`);
        const url = await response.text();
        window.location.href = url;
    } catch (e) {
        showNotification('Fitbit bağlantı hatası: ' + e.message, 'danger');
    }
}

async function simulateFitbitStream() {
    try {
        showNotification('Fitbit canlı akış simülasyonu başlatılıyor...', 'info');
        const response = await fetchWithAuth(`${API_BASE}/fitbit/heart-rate/simulated`);
        const fitbitData = await response.json();
        
        const dataset = fitbitData['activities-heart-intraday'].dataset;
        const labels = dataset.map(d => d.time);
        const hrData = dataset.map(d => d.value);
        
        // Use analysis data
        const analysis = fitbitData.analysis;
        if (analysis && analysis.alerts && analysis.alerts.length > 0) {
            analysis.alerts.forEach(alert => showNotification(alert, 'warning'));
        }

        renderChart('heartRateChart', 'Fitbit Nabız (Simüle)', labels, hrData, 'rgba(16, 185, 129, 1)', 'rgba(16, 185, 129, 0.2)');
        
        // Fake blood sugar flatline or slight change for demo
        const bsData = hrData.map(v => 95 + (v % 10));
        renderChart('bloodSugarChart', 'Kan Şekeri (Simüle)', labels, bsData, 'rgba(14, 165, 233, 1)', 'rgba(14, 165, 233, 0.2)');
        
    } catch (e) {
        showNotification('Simülasyon akışı alınamadı.', 'danger');
    }
}

function showNotification(message, type = 'warning') {
    const area = document.getElementById('notificationArea');
    const id = 'notif-' + Date.now();
    
    let icon = 'bi-info-circle';
    if (type === 'danger') icon = 'bi-exclamation-octagon';
    if (type === 'success') icon = 'bi-check-circle';
    if (type === 'warning') icon = 'bi-exclamation-triangle';

    area.innerHTML += `
        <div id="${id}" class="glass-card p-3 mb-3 d-flex align-items-center shadow-lg border-${type} animate-slide-right" style="border-left: 4px solid var(--${type});">
            <i class="bi ${icon} fs-4 text-${type} me-3"></i>
            <div>
                <h6 class="mb-1 fw-bold text-${type}">${type.toUpperCase()}</h6>
                <p class="mb-0 small">${message}</p>
            </div>
            <button type="button" class="btn-close ms-auto" onclick="document.getElementById('${id}').remove()"></button>
        </div>
    `;

    setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateX(20px)';
            el.style.transition = 'all 0.3s ease';
            setTimeout(() => el.remove(), 300);
        }
    }, 5000);
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    const btn = document.getElementById('themeToggle');
    if (isDark) {
        btn.innerHTML = '<i class="bi bi-sun-fill me-2"></i> Açık Mod';
        localStorage.setItem('theme', 'dark');
    } else {
        btn.innerHTML = '<i class="bi bi-moon-stars me-2"></i> Koyu Mod';
        localStorage.setItem('theme', 'light');
    }
    // Re-render charts to update colors
    loadHealthData();
}