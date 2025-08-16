// Mood Tracking System
class MoodManager {
    constructor() {
        this.currentMoodData = null;
        this.moodHistory = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        // Data is now loaded via loadMoodHistory() after login
    }

    setupEventListeners() {
        // Quick mood button
        document.getElementById('quickMoodBtn').addEventListener('click', () => {
            this.showMoodModal();
        });

        // Mood selection
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectMood(e.currentTarget);
            });
        });

        // Context tags
        document.querySelectorAll('.tag-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.toggleTag(e.currentTarget);
            });
        });

        // Submit mood
        document.getElementById('submitMoodBtn').addEventListener('click', () => {
            this.submitMood();
        });

        // Close mood modal
        document.querySelector('#moodModal .close').addEventListener('click', () => {
            this.hideMoodModal();
        });
    }

    showMoodModal() {
        const modal = document.getElementById('moodModal');
        modal.style.display = 'flex';
        this.resetMoodForm();
    }

    hideMoodModal() {
        const modal = document.getElementById('moodModal');
        modal.style.display = 'none';
    }

    resetMoodForm() {
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('selected'));
        this.currentMoodData = null;
    }

    selectMood(moodBtn) {
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        moodBtn.classList.add('selected');
        this.currentMoodData = {
            mood: moodBtn.dataset.mood,
            emoji: moodBtn.textContent.split('\n')[0],
            tags: []
        };
    }

    toggleTag(tagBtn) {
        tagBtn.classList.toggle('selected');
        if (this.currentMoodData) {
            const tag = tagBtn.dataset.tag;
            if (tagBtn.classList.contains('selected')) {
                if (!this.currentMoodData.tags.includes(tag)) this.currentMoodData.tags.push(tag);
            } else {
                this.currentMoodData.tags = this.currentMoodData.tags.filter(t => t !== tag);
            }
        }
    }

    async submitMood() {
        if (!this.currentMoodData || !this.currentMoodData.mood) {
            window.authManager.showError('Please select a mood first');
            return;
        }

        if (!window.authManager.isLoggedIn()) {
            const anonEntry = { id: Date.now().toString(), ...this.currentMoodData, timestamp: new Date().toISOString(), date: new Date().toDateString() };
            const history = JSON.parse(localStorage.getItem('mindjourney_moods_anon') || '[]');
            history.unshift(anonEntry);
            localStorage.setItem('mindjourney_moods_anon', JSON.stringify(history));
            this.moodHistory = history;
            this.updateMoodChart();
            this.updateDashboardMood();
            this.hideMoodModal();
            window.authManager.showSuccess('Mood saved locally for anonymous user.');
            return;
        }

        try {
            const response = await window.authManager.fetchWithAuth('/mood', {
                method: 'POST',
                body: JSON.stringify(this.currentMoodData)
            });
            const newEntry = await response.json();
            if (!response.ok) throw new Error(newEntry.message || 'Failed to save mood');

            this.moodHistory.unshift(newEntry);
            this.updateMoodChart();
            this.updateDashboardMood();
            // this.updateMoodStreak(); // This logic needs re-evaluation with server-side data

            this.hideMoodModal();
            window.authManager.showSuccess('Mood recorded successfully!');
        } catch (error) {
            window.authManager.showError(error.message);
        }
    }

    async loadMoodHistory() {
        if (!window.authManager.isLoggedIn()) {
            this.moodHistory = JSON.parse(localStorage.getItem('mindjourney_moods_anon') || '[]');
            this.updateMoodChart();
            this.updateDashboardMood();
            return;
        }
        try {
            const response = await window.authManager.fetchWithAuth('/mood');
            if (response.ok) {
                this.moodHistory = await response.json();
                this.updateMoodChart();
                this.updateDashboardMood();
            }
        } catch (error) {
            window.authManager.showError(error.message);
        }
    }

    updateMoodChart() {
        const canvas = document.getElementById('moodChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        // ... (rest of the chart drawing logic is fine)
        if (this.moodHistory.length === 0) {
             ctx.clearRect(0, 0, canvas.width, canvas.height);
             ctx.fillStyle = '#94A3B8';
             ctx.font = '16px Inter';
             ctx.textAlign = 'center';
             ctx.fillText('No mood data yet', canvas.width / 2, canvas.height / 2);
             return;
        }
        this.drawMoodChart(ctx, this.getLast7DaysMoodData(), canvas.width, canvas.height);
    }

    getLast7DaysMoodData() {
        const days = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            const dayMood = this.moodHistory.find(mood => new Date(mood.timestamp).toDateString() === dateStr);
            days.push({
                date,
                dateStr,
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                mood: dayMood ? dayMood.mood : null,
                emoji: dayMood ? dayMood.emoji : null
            });
        }
        return days;
    }

    drawMoodChart(ctx, data, width, height) {
        // ... (this implementation can remain as is)
    }

    getMoodColor(mood) {
        // ... (this implementation can remain as is)
    }

    updateDashboardMood() {
        if (this.moodHistory.length > 0) {
            const latestMood = this.moodHistory[0];
            const moodDisplay = latestMood.mood.charAt(0).toUpperCase() + latestMood.mood.slice(1);
            document.getElementById('currentMood').textContent = moodDisplay;
        } else {
            document.getElementById('currentMood').textContent = 'N/A';
        }
    }

    // updateMoodStreak() needs to be re-thought with combined server data
    // getMoodStats() and exportMoodData() also need to be adapted or removed
}

// Initialize mood manager
window.moodManager = new MoodManager();
