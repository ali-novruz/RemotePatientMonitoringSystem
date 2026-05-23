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

        const loginScreen = document.getElementById('loginScreen');
        const mainContent = document.getElementById('mainContent');

        if (loginScreen) {
            // Immediately block pointer events so overlay doesn't eat clicks
            loginScreen.style.pointerEvents = 'none';
            loginScreen.style.opacity = '0';
            loginScreen.style.transition = 'opacity 0.4s ease';

            setTimeout(() => {
                loginScreen.style.display = 'none';
            }, 450);
        }

        if (mainContent) {
            mainContent.style.display = 'block';
            window.scrollTo(0, 0);
        }

        showTab('patientTab');

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
        loginScreen.style.pointerEvents = '';
        loginScreen.style.display = 'flex';
        setTimeout(() => {
            loginScreen.style.opacity = '1';
        }, 50);
    }

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (usernameInput) usernameInput.value = '';
    if (passwordInput) passwordInput.value = '';
}
