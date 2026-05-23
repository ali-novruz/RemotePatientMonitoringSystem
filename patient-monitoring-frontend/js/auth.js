// js/auth.js - Authentication management
import { Api } from './api.js';
import { UI } from './ui.js';
import { loadPatients, showTab } from './main.js';

export async function login(event) {
    if (event) event.preventDefault();
    
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');
    
    if (!usernameInput || !passwordInput) return;
    
    loginError.style.display = 'none';

    try {
        await Api.login(usernameInput.value, passwordInput.value);
        
        // Transition to main
        const loginScreen = document.getElementById('loginScreen');
        const mainContent = document.getElementById('mainContent');
        
        if (loginScreen) {
            loginScreen.style.opacity = '0';
            setTimeout(() => {
                loginScreen.style.display = 'none';
                if (mainContent) {
                    mainContent.style.display = 'block';
                    // We must scroll to top because loginScreen might have left us scrolled
                    window.scrollTo(0, 0); 
                }
                showTab('patientTab');
            }, 500);
        }

    } catch (error) {
        loginError.style.display = 'block';
    }
}

export function logout() {
    Api.clearCredentials();
    
    const mainContent = document.getElementById('mainContent');
    const loginScreen = document.getElementById('loginScreen');
    
    if (mainContent) mainContent.style.display = 'none';
    if (loginScreen) {
        loginScreen.style.display = 'flex';
        // Reset opacity after timeout to ensure transition
        setTimeout(() => {
            loginScreen.style.opacity = '1';
        }, 50);
    }
    
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    if (usernameInput) usernameInput.value = '';
    if (passwordInput) passwordInput.value = '';
}
