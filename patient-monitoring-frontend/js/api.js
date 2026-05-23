// js/api.js - Centralized API communication

const API_BASE = 'http://localhost:8080/api';
let authCredentials = null;

export const Api = {
    setCredentials(credentials) {
        authCredentials = credentials;
    },
    
    getCredentials() {
        return authCredentials;
    },

    clearCredentials() {
        authCredentials = null;
    },

    async fetchWithAuth(endpoint, options = {}) {
        if (!authCredentials) throw new Error('Not authenticated');
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Basic ${authCredentials}`,
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            let errorMessage = 'API Error';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // Not JSON
            }
            throw new Error(errorMessage);
        }
        
        // Some endpoints like fitbit/authorize return text instead of JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const result = await response.json();
            if (result && result.success !== undefined) {
                return result.data;
            }
            return result;
        } else {
            return response.text();
        }
    },
    
    async login(username, password) {
        const credentials = btoa(`${username}:${password}`);
        const response = await fetch(`${API_BASE}/doctors`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        if (!response.ok) throw new Error('Login failed');
        this.setCredentials(credentials);
        return credentials;
    },

    async getPatients() {
        return this.fetchWithAuth('/patients');
    },

    async getDoctors() {
        return this.fetchWithAuth('/doctors');
    },

    async getHealthData(patientId) {
        return this.fetchWithAuth(`/health-data/${patientId}`);
    },

    async simulateHealthData(patientId) {
        return this.fetchWithAuth(`/health-data/simulate/${patientId}`, { method: 'POST' });
    },

    async authorizeFitbit(patientId) {
        return this.fetchWithAuth(`/fitbit/authorize?patientId=${patientId}`);
    },

    async simulateFitbitStream() {
        return this.fetchWithAuth('/fitbit/heart-rate/simulated');
    }
};
