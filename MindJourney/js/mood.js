// Mood Tracking System
class MoodManager {
    constructor() {
        this.currentMoodData = null;
        this.moodHistory = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMoodHistory();
        this.updateMoodChart();
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
        // Clear previous selections
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelectorAll('.tag-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        this.currentMoodData = null;
    }

    selectMood(moodBtn) {
        // Clear previous selection
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Select current mood
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
                if (!this.currentMoodData.tags.includes(tag)) {
                    this.currentMoodData.tags.push(tag);
                }
            } else {
                this.currentMoodData.tags = this.currentMoodData.tags.filter(t => t !== tag);
            }
        }
    }

    submitMood() {
        if (!this.currentMoodData || !this.currentMoodData.mood) {
            window.authManager.showError('Please select a mood first');
            return;
        }

        const user = window.authManager.getCurrentUser();
        if (!user) {
            window.authManager.showError('Please log in to track your mood');
            return;
        }

        // Create mood entry
        const moodEntry = {
            id: Date.now().toString(),
            userId: user.id,
            mood: this.currentMoodData.mood,
            emoji: this.currentMoodData.emoji,
            tags: this.currentMoodData.tags,
            timestamp: new Date().toISOString(),
            date: new Date().toDateString()
        };

        // Save mood entry
        const moodHistory = JSON.parse(localStorage.getItem('mindjourney_moods') || '[]');
        moodHistory.unshift(moodEntry);
        localStorage.setItem('mindjourney_moods', JSON.stringify(moodHistory));

        // Update UI
        this.loadMoodHistory();
        this.updateMoodChart();
        this.updateDashboardMood();

        // Hide modal and show success
        this.hideMoodModal();
        window.authManager.showSuccess('Mood recorded successfully!');

        // Update streak if this is first entry today
        this.updateMoodStreak();
    }

    loadMoodHistory() {
        const user = window.authManager.getCurrentUser();
        if (!user) return;

        const allMoods = JSON.parse(localStorage.getItem('mindjourney_moods') || '[]');
        this.moodHistory = allMoods.filter(mood => mood.userId === user.id);
    }

    updateMoodChart() {
        const canvas = document.getElementById('moodChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        if (this.moodHistory.length === 0) {
            // Show placeholder
            ctx.fillStyle = '#94A3B8';
            ctx.font = '16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('No mood data yet', width / 2, height / 2);
            return;
        }

        // Get last 7 days of mood data
        const last7Days = this.getLast7DaysMoodData();
        
        // Draw chart
        this.drawMoodChart(ctx, last7Days, width, height);
    }

    getLast7DaysMoodData() {
        const days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            
            // Find mood for this day
            const dayMood = this.moodHistory.find(mood => mood.date === dateStr);
            
            days.push({
                date: date,
                dateStr: dateStr,
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                mood: dayMood ? dayMood.mood : null,
                emoji: dayMood ? dayMood.emoji : null
            });
        }
        
        return days;
    }

    drawMoodChart(ctx, data, width, height) {
        const padding = 40;
        const chartWidth = width - (padding * 2);
        const chartHeight = height - (padding * 2);
        
        // Mood values for chart
        const moodValues = {
            happy: 5,
            neutral: 3,
            sad: 1,
            anxious: 2,
            angry: 1.5,
            tired: 2.5
        };

        // Draw axes
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1;
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.stroke();
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // Draw data points and line
        const pointSpacing = chartWidth / (data.length - 1);
        let previousPoint = null;

        ctx.strokeStyle = '#4F46E5';
        ctx.fillStyle = '#4F46E5';
        ctx.lineWidth = 2;

        data.forEach((day, index) => {
            const x = padding + (index * pointSpacing);
            
            // Draw day labels
            ctx.fillStyle = '#64748B';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(day.dayName, x, height - 10);

            if (day.mood) {
                const moodValue = moodValues[day.mood] || 3;
                const y = height - padding - (moodValue / 5) * chartHeight;

                // Draw line to previous point
                if (previousPoint) {
                    ctx.strokeStyle = '#4F46E5';
                    ctx.beginPath();
                    ctx.moveTo(previousPoint.x, previousPoint.y);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }

                // Draw point
                ctx.fillStyle = this.getMoodColor(day.mood);
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, 2 * Math.PI);
                ctx.fill();

                // Draw emoji above point
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(day.emoji, x, y - 15);

                previousPoint = { x, y };
            }
        });
    }

    getMoodColor(mood) {
        const colors = {
            happy: '#10B981',
            neutral: '#6B7280',
            sad: '#3B82F6',
            anxious: '#F59E0B',
            angry: '#EF4444',
            tired: '#8B5CF6'
        };
        return colors[mood] || '#6B7280';
    }

    updateDashboardMood() {
        if (this.moodHistory.length > 0) {
            const latestMood = this.moodHistory[0];
            const moodDisplay = latestMood.mood.charAt(0).toUpperCase() + latestMood.mood.slice(1);
            document.getElementById('currentMood').textContent = moodDisplay;
        }
    }

    updateMoodStreak() {
        const user = window.authManager.getCurrentUser();
        if (!user) return;

        // Check if user has mood entry for today
        const today = new Date().toDateString();
        const todayMood = this.moodHistory.find(mood => mood.date === today);
        
        if (todayMood) {
            // Update journal streak as well since mood check counts
            const journalEntries = window.journalManager.getUserEntries(user.id);
            const allEntries = [...journalEntries, ...this.moodHistory];
            
            // Sort by date and calculate streak
            const sortedEntries = allEntries.sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp));
            const streak = this.calculateCombinedStreak(sortedEntries);
            
            document.getElementById('currentStreak').textContent = streak;
        }
    }

    calculateCombinedStreak(entries) {
        if (entries.length === 0) return 0;

        let streak = 0;
        const today = new Date();
        const uniqueDates = new Set();
        
        // Get unique dates from entries
        entries.forEach(entry => {
            const entryDate = new Date(entry.createdAt || entry.timestamp);
            const dateStr = entryDate.toDateString();
            uniqueDates.add(dateStr);
        });
        
        const sortedDates = Array.from(uniqueDates).sort((a, b) => new Date(b) - new Date(a));
        
        // Calculate consecutive days
        for (let i = 0; i < sortedDates.length; i++) {
            const date = new Date(sortedDates[i]);
            const daysDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === i) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    getMoodStats() {
        const user = window.authManager.getCurrentUser();
        if (!user) return null;

        const userMoods = this.moodHistory;
        if (userMoods.length === 0) return null;

        // Calculate mood distribution
        const moodCounts = {};
        userMoods.forEach(mood => {
            moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1;
        });

        // Find most common mood
        const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => 
            moodCounts[a] > moodCounts[b] ? a : b
        );

        // Calculate average mood score
        const moodValues = {
            happy: 5,
            neutral: 3,
            sad: 1,
            anxious: 2,
            angry: 1.5,
            tired: 2.5
        };

        const totalScore = userMoods.reduce((sum, mood) => sum + (moodValues[mood.mood] || 3), 0);
        const averageScore = totalScore / userMoods.length;

        return {
            totalEntries: userMoods.length,
            mostCommonMood: mostCommonMood,
            averageScore: averageScore,
            distribution: moodCounts,
            last7Days: this.getLast7DaysMoodData()
        };
    }

    exportMoodData() {
        const user = window.authManager.getCurrentUser();
        if (!user) return null;

        const stats = this.getMoodStats();
        if (!stats) return null;

        return {
            userId: user.id,
            exportDate: new Date().toISOString(),
            stats: stats,
            rawData: this.moodHistory
        };
    }
}

// Initialize mood manager
window.moodManager = new MoodManager();
