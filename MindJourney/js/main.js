// Main Application Controller
class MindJourneyApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupSettings();
        this.loadUserPreferences();
        this.initializeManagers();
    }

    setupNavigation() {
        // Navigation between pages
        document.querySelectorAll('.nav-item:not(.logout)').forEach(navItem => {
            navItem.addEventListener('click', (e) => {
                const targetPage = e.currentTarget.dataset.page;
                if (targetPage) {
                    this.navigateToPage(targetPage);
                }
            });
        });

        // Dashboard action buttons
        document.getElementById('writeJournalBtn').addEventListener('click', () => {
            this.navigateToPage('template');
        });
        
        document.getElementById('viewInsightsBtn').addEventListener('click', () => {
            this.navigateToPage('insights');
            this.initializeInsightsTabs();
        });
        
        // Settings button in nav
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.navigateToPage('settings');
        });
        
        // Initialize template selection and insights tabs
        this.initializeTemplateSelection();
        this.initializeInsightsTabs();
    }

    navigateToPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(`${pageName}Page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(navItem => {
            navItem.classList.remove('active');
        });

        const activeNavItem = document.querySelector(`[data-page="${pageName}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        this.currentPage = pageName;

        // Refresh page-specific content
        this.refreshPageContent(pageName);
    }

    refreshPageContent(pageName) {
        switch (pageName) {
            case 'dashboard':
                this.refreshDashboard();
                break;
            case 'insights':
                window.insightsManager.loadInsights();
                this.updateInsightsStats();
                break;
            case 'journal':
                window.journalManager.updateJournalDate();
                break;
            case 'template':
                // Template page doesn't need special initialization
                break;
        }
    }

    refreshDashboard() {
        // Update stats
        this.updateDashboardStats();
        this.updateMoodWeekGrid();
        
        // Set daily quote
        window.recommendationManager.setDailyQuote();
    }
    
    updateDashboardStats() {
        const user = window.authManager.getCurrentUser();
        if (!user) return;

        const entries = window.journalManager.getUserEntries();
        const moods = window.moodManager.moodHistory;
        
        // Calculate streak
        const allEntries = [...entries, ...moods];
        const uniqueDates = new Set();
        allEntries.forEach(entry => {
            const date = new Date(entry.createdAt || entry.timestamp).toDateString();
            uniqueDates.add(date);
        });

        const streak = this.calculateStreak(Array.from(uniqueDates));
        const streakText = streak === 1 ? '1 Day' : `${streak} Days`;
        document.getElementById('currentStreak').textContent = streakText;
    }
    
    calculateStreak(dates) {
        if (dates.length === 0) return 0;

        const sortedDates = dates.sort((a, b) => new Date(b) - new Date(a));
        let streak = 0;

        for (let i = 0; i < sortedDates.length; i++) {
            const expectedDate = new Date();
            expectedDate.setDate(expectedDate.getDate() - i);
            const expectedDateStr = expectedDate.toDateString();

            if (sortedDates[i] === expectedDateStr) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }
    
    updateMoodWeekGrid() {
        const moodHistory = window.moodManager.moodHistory;
        const today = new Date();
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        // Get current week's dates
        const weekDates = [];
        const startOfWeek = new Date(today);
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Monday start
        startOfWeek.setDate(diff);
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            weekDates.push(date);
        }
        
        // Update the grid
        const grid = document.getElementById('moodWeekGrid');
        grid.innerHTML = '';
        
        weekDates.forEach((date, index) => {
            const dateStr = date.toDateString();
            const mood = moodHistory.find(m => m.date === dateStr);
            const isToday = date.toDateString() === today.toDateString();
            
            const dayElement = document.createElement('div');
            dayElement.className = 'mood-day';
            
            dayElement.innerHTML = `
                <div class="mood-day-label">${days[index]}</div>
                <div class="mood-day-indicator ${mood ? 'has-mood' : 'empty'} ${isToday ? 'today' : ''}">
                    ${mood ? mood.emoji : '?'}
                </div>
            `;
            
            // Add click handler for mood entry
            dayElement.addEventListener('click', () => {
                if (!mood) {
                    window.moodManager.showMoodModal();
                }
            });
            
            grid.appendChild(dayElement);
        });
    }

    setupSettings() {
        // Theme selector
        document.getElementById('themeSelect').addEventListener('change', (e) => {
            this.applyTheme(e.target.value);
        });

        // Color scheme selector
        document.getElementById('colorScheme').addEventListener('change', (e) => {
            this.applyColorScheme(e.target.value);
        });

        // Text size selector
        document.getElementById('textSize').addEventListener('change', (e) => {
            this.applyTextSize(e.target.value);
        });

        // Anonymous mode toggle
        document.getElementById('anonymousMode').addEventListener('change', (e) => {
            this.toggleAnonymousMode(e.target.checked);
        });
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.saveUserPreference('theme', theme);
    }

    applyColorScheme(scheme) {
        document.documentElement.setAttribute('data-color-scheme', scheme);
        this.saveUserPreference('colorScheme', scheme);
    }

    applyTextSize(size) {
        document.documentElement.setAttribute('data-text-size', size);
        this.saveUserPreference('textSize', size);
    }

    toggleAnonymousMode(enabled) {
        const user = window.authManager.getCurrentUser();
        if (user) {
            user.anonymousMode = enabled;
            window.authManager.saveUserSession();
            this.saveUserPreference('anonymousMode', enabled);
            
            if (enabled) {
                window.authManager.showInfo('Anonymous mode enabled. Your data remains private.');
            } else {
                window.authManager.showInfo('Anonymous mode disabled.');
            }
        }
    }

    saveUserPreference(key, value) {
        const user = window.authManager.getCurrentUser();
        if (user) {
            if (!user.settings) user.settings = {};
            user.settings[key] = value;
            window.authManager.saveUserSession();
        }
    }

    loadUserPreferences() {
        const user = window.authManager.getCurrentUser();
        if (user && user.settings) {
            const settings = user.settings;
            
            // Apply saved preferences
            if (settings.theme) {
                this.applyTheme(settings.theme);
                document.getElementById('themeSelect').value = settings.theme;
            }
            
            if (settings.colorScheme) {
                this.applyColorScheme(settings.colorScheme);
                document.getElementById('colorScheme').value = settings.colorScheme;
            }
            
            if (settings.textSize) {
                this.applyTextSize(settings.textSize);
                document.getElementById('textSize').value = settings.textSize;
            }
            
            if (settings.anonymousMode !== undefined) {
                document.getElementById('anonymousMode').checked = settings.anonymousMode;
            }
        }
    }

    initializeManagers() {
        // Load custom recommendations
        window.recommendationManager.loadCustomRecommendations();
        
        // Set up periodic data backup
        this.setupDataBackup();
        
        // Initialize success stories rotation
        this.initializeSuccessStories();
    }

    setupDataBackup() {
        // Auto-backup user data every 5 minutes
        setInterval(() => {
            this.backupUserData();
        }, 5 * 60 * 1000);
    }

    backupUserData() {
        const user = window.authManager.getCurrentUser();
        if (!user) return;

        const backupData = {
            timestamp: new Date().toISOString(),
            user: user,
            entries: window.journalManager.getUserEntries(),
            moods: window.moodManager.moodHistory,
            settings: user.settings || {}
        };

        localStorage.setItem('mindjourney_backup', JSON.stringify(backupData));
    }

    restoreFromBackup() {
        const backup = localStorage.getItem('mindjourney_backup');
        if (!backup) return false;

        try {
            const backupData = JSON.parse(backup);
            
            // Restore user data
            if (backupData.entries) {
                localStorage.setItem('mindjourney_entries', JSON.stringify(backupData.entries));
            }
            
            if (backupData.moods) {
                localStorage.setItem('mindjourney_moods', JSON.stringify(backupData.moods));
            }

            window.authManager.showSuccess('Data restored from backup!');
            
            // Refresh current page
            this.refreshPageContent(this.currentPage);
            
            return true;
        } catch (error) {
            window.authManager.showError('Failed to restore backup data');
            return false;
        }
    }

    initializeSuccessStories() {
        // Add success stories to insights page
        const successStory = window.recommendationManager.getSuccessStory();
        
        // Create success stories section if it doesn't exist
        const insightsContainer = document.querySelector('.insights-grid');
        if (insightsContainer && !document.getElementById('successStories')) {
            const successStoriesCard = document.createElement('div');
            successStoriesCard.className = 'insight-card';
            successStoriesCard.innerHTML = `
                <h3>Success Story of the Week</h3>
                <div id="successStories">${window.recommendationManager.displaySuccessStory()}</div>
            `;
            insightsContainer.appendChild(successStoriesCard);
        }
    }

    exportAllData() {
        const user = window.authManager.getCurrentUser();
        if (!user) {
            window.authManager.showError('Please log in to export data');
            return;
        }

        const exportData = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                settings: user.settings
            },
            journal: {
                entries: window.journalManager.getUserEntries(),
                stats: window.insightsManager.getUserStats()
            },
            mood: {
                history: window.moodManager.moodHistory,
                stats: window.moodManager.getMoodStats()
            },
            recommendations: window.recommendationManager.exportRecommendations(),
            exportInfo: {
                date: new Date().toISOString(),
                version: '1.0.0',
                appName: 'MindJourney'
            }
        };

        // Create and download file
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
            type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mindjourney-complete-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        window.authManager.showSuccess('Complete data export downloaded!');
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
            if (confirm('This will permanently delete all your journal entries, mood data, and settings. Continue?')) {
                // Clear all app data
                localStorage.removeItem('mindjourney_entries');
                localStorage.removeItem('mindjourney_moods');
                localStorage.removeItem('mindjourney_draft');
                localStorage.removeItem('mindjourney_custom_recs');
                localStorage.removeItem('mindjourney_favorites');
                localStorage.removeItem('mindjourney_backup');
                
                // Reset UI
                document.getElementById('totalEntries').textContent = '0';
                document.getElementById('currentStreak').textContent = '0';
                document.getElementById('currentMood').textContent = 'Neutral';
                
                // Refresh insights
                window.insightsManager.loadInsights();
                window.moodManager.updateMoodChart();
                
                window.authManager.showSuccess('All data cleared successfully');
            }
        }
    }

    // Keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only trigger shortcuts when not typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            // Ctrl/Cmd + shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        this.navigateToPage('dashboard');
                        break;
                    case '2':
                        e.preventDefault();
                        this.navigateToPage('journal');
                        break;
                    case '3':
                        e.preventDefault();
                        this.navigateToPage('insights');
                        break;
                    case 's':
                        e.preventDefault();
                        if (this.currentPage === 'journal') {
                            document.getElementById('saveJournalBtn').click();
                        }
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportAllData();
                        break;
                }
            }

            // Quick mood check with 'm' key
            if (e.key === 'm' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                window.moodManager.showMoodModal();
            }
        });
    }

    // Initialize app when DOM is loaded
    onDOMContentLoaded() {
        this.setupKeyboardShortcuts();
        
        // Add export button to settings
        this.addExportButton();
        
        // Show welcome message for new users
        this.showWelcomeMessage();
        
        // Initialize template selection and insights tabs
        this.initializeTemplateSelection();
        this.initializeInsightsTabs();
    }
    
    initializeTemplateSelection() {
        const templateCards = document.querySelectorAll('.template-card');
        templateCards.forEach(card => {
            card.addEventListener('click', () => {
                const template = card.dataset.template;
                this.navigateToPage('journal');
                if (window.journalManager) {
                    window.journalManager.initializeWithTemplate(template);
                }
            });
        });
    }
    
    initializeInsightsTabs() {
        const tabs = document.querySelectorAll('.insights-tab');
        const tabContents = document.querySelectorAll('.insights-tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;

                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                const targetContent = document.getElementById(targetTab + 'Tab');
                if (targetContent) {
                    targetContent.classList.add('active');
                }

                // Load specific content based on tab
                if (targetTab === 'foryou') {
                    this.loadPersonalizedRecommendations();
                }
            });
        });
    }
    
    updateInsightsStats() {
        const user = window.authManager.getCurrentUser();
        if (!user) return;

        const entries = window.journalManager.getUserEntries();
        const moods = window.moodManager.moodHistory;
        
        // Update stats in insights page
        const streakElement = document.getElementById('insightCurrentStreak');
        const entriesElement = document.getElementById('insightTotalEntries');
        const moodCheckinsElement = document.getElementById('insightMoodCheckins');
        
        if (streakElement) {
            const allEntries = [...entries, ...moods];
            const uniqueDates = new Set();
            allEntries.forEach(entry => {
                const date = new Date(entry.createdAt || entry.timestamp).toDateString();
                uniqueDates.add(date);
            });
            const streak = this.calculateStreak(Array.from(uniqueDates));
            streakElement.textContent = streak;
        }
        
        if (entriesElement) {
            entriesElement.textContent = entries.length;
        }
        
        if (moodCheckinsElement) {
            moodCheckinsElement.textContent = moods.length;
        }
        
        // Update common mood
        this.updateCommonMood(moods);
    }
    
    updateCommonMood(moods) {
        if (moods.length === 0) return;
        
        // Count mood frequencies
        const moodCounts = {};
        moods.forEach(entry => {
            const mood = entry.mood || 'happy';
            moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });
        
        // Find most common mood
        let mostCommonMood = 'happy';
        let maxCount = 0;
        
        for (const [mood, count] of Object.entries(moodCounts)) {
            if (count > maxCount) {
                maxCount = count;
                mostCommonMood = mood;
            }
        }
        
        const percentage = Math.round((maxCount / moods.length) * 100);
        
        // Update UI
        const moodEmojis = {
            'happy': '😊',
            'sad': '😢',
            'anxious': '😰',
            'angry': '😠',
            'excited': '🤩',
            'calm': '😌',
            'stressed': '😤',
            'grateful': '🙏'
        };
        
        const moodEmojiElement = document.querySelector('.mood-emoji');
        const moodNameElement = document.querySelector('.mood-name');
        const moodPercentageElement = document.querySelector('.mood-percentage');
        
        if (moodEmojiElement) {
            moodEmojiElement.textContent = moodEmojis[mostCommonMood] || '😊';
        }
        if (moodNameElement) {
            moodNameElement.textContent = mostCommonMood.charAt(0).toUpperCase() + mostCommonMood.slice(1);
        }
        if (moodPercentageElement) {
            moodPercentageElement.textContent = `This was your mood ${percentage}% of the time.`;
        }
    }
    
    loadPersonalizedRecommendations() {
        const container = document.getElementById('personalizedRecs');
        if (!container) return;
        
        const user = window.authManager.getCurrentUser();
        const moods = window.moodManager.moodHistory;
        
        // Get recent mood to personalize recommendations
        const recentMood = moods.length > 0 ? moods[moods.length - 1].mood : 'happy';
        
        const recommendations = this.getRecommendationsForMood(recentMood);
        
        container.innerHTML = recommendations.map(rec => `
            <div class="recommendation-card">
                <div class="rec-type-icon ${rec.type}-icon">
                    <i class="fas fa-${rec.icon}"></i>
                </div>
                <h5>${rec.title}</h5>
                ${rec.author ? `<div class="author">by ${rec.author}</div>` : ''}
                <p>${rec.description}</p>
                <div class="rec-mood-tag">For ${recentMood} moods</div>
            </div>
        `).join('');
    }
    
    getRecommendationsForMood(mood) {
        const allRecs = {
            music: [
                { type: 'music', icon: 'music', title: 'Weightless', author: 'Marconi Union', description: 'Scientifically designed to reduce anxiety by 65%' },
                { type: 'music', icon: 'music', title: 'Clair de Lune', author: 'Claude Debussy', description: 'Classical piece known for its calming effects' },
                { type: 'music', icon: 'music', title: 'Aqueous Transmission', author: 'Incubus', description: 'Ambient rock that promotes deep relaxation' }
            ],
            quotes: [
                { type: 'quote', icon: 'quote-right', title: 'Daily Inspiration', author: 'Maya Angelou', description: '"You may not control all the events that happen to you, but you can decide not to be reduced by them."' },
                { type: 'quote', icon: 'quote-right', title: 'Mindful Moment', author: 'Thich Nhat Hanh', description: '"The present moment is the only time over which we have dominion."' }
            ],
            movies: [
                { type: 'movie', icon: 'film', title: 'Inside Out', author: 'Pixar', description: 'A beautiful exploration of emotions and mental health' },
                { type: 'movie', icon: 'film', title: 'A Beautiful Mind', author: 'Ron Howard', description: 'Inspiring story about overcoming mental health challenges' }
            ],
            books: [
                { type: 'book', icon: 'book', title: 'The Gifts of Imperfection', author: 'Brené Brown', description: 'A guide to wholehearted living and self-compassion' },
                { type: 'book', icon: 'book', title: 'Mindfulness for Beginners', author: 'Jon Kabat-Zinn', description: 'Introduction to mindfulness meditation practices' }
            ]
        };

        // Mix different types of recommendations
        return [
            allRecs.music[0],
            allRecs.quotes[0],
            allRecs.movies[0],
            allRecs.books[0],
            allRecs.music[1],
            allRecs.quotes[1]
        ];
    }

    addExportButton() {
        const settingsContainer = document.querySelector('.settings-container');
        if (settingsContainer) {
            const exportSection = document.createElement('div');
            exportSection.className = 'settings-section';
            exportSection.innerHTML = `
                <h3>Data Management</h3>
                <div class="setting-item">
                    <button class="btn-secondary" onclick="app.exportAllData()">
                        <i class="fas fa-download"></i> Export All Data
                    </button>
                </div>
                <div class="setting-item">
                    <button class="btn-secondary" onclick="app.restoreFromBackup()">
                        <i class="fas fa-upload"></i> Restore from Backup
                    </button>
                </div>
                <div class="setting-item">
                    <button class="btn-secondary" onclick="app.clearAllData()" style="color: var(--error-color);">
                        <i class="fas fa-trash"></i> Clear All Data
                    </button>
                </div>
            `;
            settingsContainer.appendChild(exportSection);
        }
    }

    showWelcomeMessage() {
        const user = window.authManager.getCurrentUser();
        if (user && !localStorage.getItem('mindjourney_welcomed')) {
            // Update welcome message based on time of day
            const hour = new Date().getHours();
            let greeting = 'Good Morning';
            if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
            else if (hour >= 17) greeting = 'Good Evening';
            
            const userName = user.name && user.name !== 'Anonymous User' ? `, ${user.name.split(' ')[0]}` : ', there';
            document.getElementById('welcomeMessage').textContent = `${greeting}${userName}!`;
            
            setTimeout(() => {
                const welcomeModal = document.createElement('div');
                welcomeModal.className = 'modal';
                welcomeModal.innerHTML = `
                    <div class="modal-content" style="max-width: 500px;">
                        <span class="close">&times;</span>
                        <h3>Welcome to MindJourney! 🌟</h3>
                        <div style="text-align: left; line-height: 1.6;">
                            <p>You're about to start an amazing journey of self-discovery and mental wellness. Here's how to get started:</p>
                            <ul style="margin: 20px 0;">
                                <li><strong>Write your first journal entry</strong> - Share what's on your mind</li>
                                <li><strong>Track your mood</strong> - Quick daily check-ins help identify patterns</li>
                                <li><strong>Get personalized recommendations</strong> - Movies, music, and quotes based on your mood</li>
                                <li><strong>View your insights</strong> - Track your progress and celebrate achievements</li>
                            </ul>
                            <p><strong>Pro tip:</strong> Use keyboard shortcuts like <code>Ctrl+2</code> to quickly access journaling!</p>
                        </div>
                        <button class="btn-primary" onclick="this.parentElement.parentElement.remove()">
                            Let's Begin! 🚀
                        </button>
                    </div>
                `;

                document.body.appendChild(welcomeModal);
                welcomeModal.style.display = 'flex';

                welcomeModal.querySelector('.close').addEventListener('click', () => {
                    document.body.removeChild(welcomeModal);
                });

                localStorage.setItem('mindjourney_welcomed', 'true');
            }, 2000);
        } else if (user) {
            // Update greeting for returning users
            const hour = new Date().getHours();
            let greeting = 'Good Morning';
            if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
            else if (hour >= 17) greeting = 'Good Evening';
            
            const userName = user.name && user.name !== 'Anonymous User' ? `, ${user.name.split(' ')[0]}` : ', there';
            document.getElementById('welcomeMessage').textContent = `${greeting}${userName}!`;
        }
    }
}

// Initialize the app
const app = new MindJourneyApp();

// Setup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app.onDOMContentLoaded();
});

// Handle window close - save draft
window.addEventListener('beforeunload', () => {
    if (window.journalManager) {
        window.journalManager.saveDraft();
    }
    if (app) {
        app.backupUserData();
    }
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('MindJourney Error:', e.error);
    if (window.authManager) {
        window.authManager.showError('Something went wrong. Please try again.');
    }
});

// Service worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
