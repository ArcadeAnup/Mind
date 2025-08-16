import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAnonymous = false;
        this.auth = getAuth();
        this.apiUrl = 'http://localhost:3000/api';
        this.init();
    }

    init() {
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                this.currentUser = user;
                this.isAnonymous = user.isAnonymous;
                this.showApp();
            } else {
                this.currentUser = null;
                this.isAnonymous = false;
                this.showAuthModal();
            }
        });
        this.setupAuthEventListeners();
    }

    showAuthModal() {
        const modal = document.getElementById('authModal');
        if(modal) modal.style.display = 'flex';
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if(modal) modal.style.display = 'none';
    }

    showApp() {
        document.getElementById('app').style.display = 'flex';
        this.hideAuthModal();
        
        const welcomeMsg = document.getElementById('welcomeMessage');
        if (this.isAnonymous) {
            welcomeMsg.textContent = 'Welcome to your journey!';
        } else if (this.currentUser && this.currentUser.email) {
            welcomeMsg.textContent = `Welcome back, ${this.currentUser.email}!`;
        } else {
            welcomeMsg.textContent = 'Welcome back!';
        }

        if (!this.isAnonymous) {
            window.journalManager.loadEntries();
            window.moodManager.loadMoodHistory();
        }
    }

    setupAuthEventListeners() {
        // ... (event listeners remain the same)
    }

    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        if (!email || !password) return this.showError('Please fill in all fields');
        try {
            await signInWithEmailAndPassword(this.auth, email, password);
            this.showSuccess('Logged in successfully!');
        } catch (error) {
            this.showError(error.message);
        }
    }

    async handleRegister() {
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        if (!email || !password) return this.showError('Please fill in required fields');
        if (password.length < 6) return this.showError('Password must be at least 6 characters');
        try {
            await createUserWithEmailAndPassword(this.auth, email, password);
            this.showSuccess('Account created successfully!');
        } catch (error) {
            this.showError(error.message);
        }
    }

    async handleGoogleAuth() {
        // This would require setting up Google as a provider in Firebase
        this.showInfo('Google Sign-In with Firebase would be set up here.');
    }

    async handleAnonymousLogin() {
        try {
            await signInAnonymously(this.auth);
            this.showSuccess('Welcome! Your data will be stored locally.');
        } catch (error) {
            this.showError('Anonymous login failed: ' + error.message);
        }
    }

    async logout() {
        try {
            await signOut(this.auth);
            this.showInfo('You have been logged out');
        } catch (error) {
            this.showError(error.message);
        }
    }

    showError(message) { this.showNotification(message, 'error'); }
    showSuccess(message) { this.showNotification(message, 'success'); }
    showInfo(message) { this.showNotification(message, 'info'); }

    showNotification(message, type = 'info') {
        // ... (notification logic remains the same)
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return !!this.currentUser && !this.isAnonymous;
    }

    async fetchWithAuth(url, options = {}) {
        if (!this.currentUser) throw new Error('User not logged in');

        const token = await this.currentUser.getIdToken();
        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };

        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(`${this.apiUrl}${url}`, { ...options, headers });

        if (response.status === 401) {
            this.logout();
            throw new Error('Session expired. Please log in again.');
        }

        return response;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});
