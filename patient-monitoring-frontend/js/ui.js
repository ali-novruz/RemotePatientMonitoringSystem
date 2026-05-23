// js/ui.js - Centralized UI and DOM management

let heartRateChart = null;
let bloodSugarChart = null;

export const UI = {
    showNotification(message, type = 'warning') {
        const area = document.getElementById('notificationArea');
        if (!area) return;
        
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
    },

    updateDate() {
        const dateEl = document.getElementById('currentDate');
        if (dateEl) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateEl.textContent = new Date().toLocaleDateString('en-US', options);
        }
    },

    showTab(tabId) {
        document.querySelectorAll('.tab-pane').forEach(tab => {
            tab.classList.remove('show', 'active');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
            selectedTab.classList.add('show', 'active');
        }
        
        const linkTarget = tabId === 'patientTab' ? 0 : 1;
        const links = document.querySelectorAll('.nav-link');
        if (links.length > linkTarget) {
            links[linkTarget].classList.add('active');
        }
    },

    toggleTheme() {
        const isDark = document.body.classList.toggle('dark-mode');
        const btn = document.getElementById('themeToggle');
        if (btn) {
            if (isDark) {
                btn.innerHTML = '<i class="bi bi-sun-fill me-2"></i> Light Mode';
                localStorage.setItem('theme', 'dark');
            } else {
                btn.innerHTML = '<i class="bi bi-moon-stars me-2"></i> Dark Mode';
                localStorage.setItem('theme', 'light');
            }
        }
        return isDark;
    },

    renderChart(canvasId, label, labels, data, borderColor, bgColor) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
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
    },

    updateChartsAndSummary(healthData) {
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

        const labels = healthData.map(d => new Date(d.recordedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
        const hrData = healthData.map(d => d.heartRate);
        const bsData = healthData.map(d => d.bloodSugar);

        this.renderChart('heartRateChart', 'Heart Rate (bpm)', labels, hrData, 'rgba(239, 68, 68, 1)', 'rgba(239, 68, 68, 0.2)');
        this.renderChart('bloodSugarChart', 'Blood Sugar', labels, bsData, 'rgba(14, 165, 233, 1)', 'rgba(14, 165, 233, 0.2)');
    }
};
