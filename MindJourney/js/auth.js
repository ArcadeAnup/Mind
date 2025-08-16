// Authentication System
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAnonymous = false;
        this.init();
    }

    init() {
        // Check for existing session
        const savedUser = localStorage.getItem('mindjourney_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showApp();
        } else {
            this.showAuthModal();
        }
    }

    showAuthModal() {
        const modal = document.getElementById('authModal');
        modal.style.display = 'flex';
        
        // Setup event listeners
        this.setupAuthEventListeners();
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        modal.style.display = 'none';
    }

    showApp() {
        document.getElementById('app').style.display = 'flex';
        this.hideAuthModal();
        
        // Update welcome message
        const welcomeMsg = document.getElementById('welcomeMessage');
        if (this.isAnonymous) {
            welcomeMsg.textContent = 'Welcome to your journey!';
        } else if (this.currentUser && this.currentUser.name) {
            welcomeMsg.textContent = `Welcome back, ${this.currentUser.name}!`;
        } else {
            welcomeMsg.textContent = 'Welcome back!';
        }
    }

    setupAuthEventListeners() {
        // Tab switching
        const tabBtns = document.querySelectorAll('.tab-btn');
        const authForms = document.querySelectorAll('.auth-form');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // Update active tab
                tabBtns.forEach(t => t.classList.remove('active'));
                btn.classList.add('active');
                
                // Show corresponding form
                authForms.forEach(form => {
                    form.classList.remove('active');
                    if (form.id === `${targetTab}Form`) {
                        form.classList.add('active');
                    }
                });
            });
        });

        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Register form
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Google OAuth (simulated)
        document.getElementById('googleLogin').addEventListener('click', () => {
            this.handleGoogleAuth();
        });

        document.getElementById('googleRegister').addEventListener('click', () => {
            this.handleGoogleAuth();
        });

        // Anonymous login
        document.getElementById('anonymousLogin').addEventListener('click', () => {
            this.handleAnonymousLogin();
        });

        // Close modal
        document.querySelector('.close').addEventListener('click', () => {
            // Only allow closing if user is logged in
            if (this.currentUser) {
                this.hideAuthModal();
            }
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            this.showError('Please fill in all fields');
            return;
        }

        // Simulate login (in real app, this would be an API call)
        const savedUsers = JSON.parse(localStorage.getItem('mindjourney_users') || '[]');
        const user = savedUsers.find(u => u.email === email && u.password === password);

        if (user) {
            this.currentUser = user;
            this.saveUserSession();
            this.showApp();
            this.showSuccess('Welcome back!');
        } else {
            this.showError('Invalid email or password');
        }
    }

    handleRegister() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        if (!email || !password) {
            this.showError('Please fill in required fields');
            return;
        }

        if (password.length < 6) {
            this.showError('Password must be at least 6 characters');
            return;
        }

        // Check if user already exists
        const savedUsers = JSON.parse(localStorage.getItem('mindjourney_users') || '[]');
        if (savedUsers.find(u => u.email === email)) {
            this.showError('User with this email already exists');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name: name || 'User',
            email: email,
            password: password, // In real app, this would be hashed
            createdAt: new Date().toISOString(),
            settings: {
                theme: 'light',
                colorScheme: 'blue',
                textSize: 'medium'
            }
        };

        savedUsers.push(newUser);
        localStorage.setItem('mindjourney_users', JSON.stringify(savedUsers));

        this.currentUser = newUser;
        this.saveUserSession();
        this.showApp();
        this.showSuccess('Account created successfully!');
    }

    handleGoogleAuth() {
        // Simulate Google OAuth
        this.showInfo('Google OAuth would be implemented here');
        
        // For demo, create a mock Google user
        const mockGoogleUser = {
            id: 'google_' + Date.now(),
            name: 'Demo User',
            email: 'demo@gmail.com',
            provider: 'google',
            createdAt: new Date().toISOString(),
            settings: {
                theme: 'light',
                colorScheme: 'blue',
                textSize: 'medium'
            }
        };

        this.currentUser = mockGoogleUser;
        this.saveUserSession();
        this.showApp();
        this.showSuccess('Signed in with Google!');
    }

    handleAnonymousLogin() {
        this.isAnonymous = true;
        this.currentUser = {
            id: 'anonymous_' + Date.now(),
            name: 'Anonymous User',
            isAnonymous: true,
            createdAt: new Date().toISOString(),
            settings: {
                theme: 'light',
                colorScheme: 'blue',
                textSize: 'medium'
            }
        };

        this.saveUserSession();
        this.showApp();
        this.showSuccess('Welcome! Your data will be stored locally.');
    }

    saveUserSession() {
        localStorage.setItem('mindjourney_user', JSON.stringify(this.currentUser));
    }

    logout() {
        this.currentUser = null;
        this.isAnonymous = false;
        localStorage.removeItem('mindjourney_user');
        document.getElementById('app').style.display = 'none';
        this.showAuthModal();
        this.showInfo('You have been logged out');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            animation: 'slideInRight 0.3s ease',
            maxWidth: '300px'
        });

        // Set background color based on type
        const colors = {
            success: '#10B981',
            error: '#EF4444',
            info: '#3B82F6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return !!this.currentUser;
    }
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Initialize auth manager
window.authManager = new AuthManager();
