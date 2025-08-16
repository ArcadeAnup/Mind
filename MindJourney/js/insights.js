// Insights and Analytics System
class InsightsManager {
    constructor() {
        this.achievements = [
            {
                id: 'first_steps',
                name: 'First Steps',
                description: 'Complete your first journal entry',
                icon: '🌱',
                condition: (stats) => stats.totalEntries >= 1
            },
            {
                id: 'week_warrior',
                name: 'Week Warrior',
                description: '7-day journaling streak',
                icon: '🔥',
                condition: (stats) => stats.currentStreak >= 7
            },
            {
                id: 'monthly_mindfulness',
                name: 'Monthly Mindfulness',
                description: '30-day journaling streak',
                icon: '🏆',
                condition: (stats) => stats.currentStreak >= 30
            },
            {
                id: 'deep_thinker',
                name: 'Deep Thinker',
                description: 'Write 10 detailed entries (500+ words)',
                icon: '🧠',
                condition: (stats) => stats.longEntries >= 10
            },
            {
                id: 'mood_tracker',
                name: 'Mood Tracker',
                description: 'Complete 30 mood check-ins',
                icon: '😊',
                condition: (stats) => stats.moodEntries >= 30
            },
            {
                id: 'consistent_writer',
                name: 'Consistent Writer',
                description: 'Journal for 100 days total',
                icon: '📚',
                condition: (stats) => stats.totalDays >= 100
            }
        ];
        this.init();
    }

    init() {
        this.loadInsights();
    }

    loadInsights() {
        const user = window.authManager.getCurrentUser();
        if (!user) return;

        this.displayJournalHistory();
        this.displayMoodCalendar();
        this.displayWeeklySummary();
        this.displayAchievements();
    }

    displayJournalHistory() {
        const historyContainer = document.getElementById('journalHistory');
        const entries = window.journalManager.getUserEntries();
        
        if (entries.length === 0) {
            historyContainer.innerHTML = '<p class="empty-state">No journal entries yet. Start writing to see your history!</p>';
            return;
        }

        const historyHTML = entries.slice(0, 10).map(entry => {
            const date = new Date(entry.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            
            const preview = entry.text.length > 100 
                ? entry.text.substring(0, 100) + '...' 
                : entry.text;
            
            const moodEmoji = this.getMoodEmoji(entry.mood);
            
            return `
                <div class="history-item" onclick="insightsManager.viewEntry('${entry.id}')">
                    <div class="history-date">
                        ${date} ${moodEmoji ? `${moodEmoji}` : ''}
                        ${entry.templateTitle ? `<span class="template-badge">${entry.templateTitle}</span>` : ''}
                    </div>
                    <div class="history-preview">${preview}</div>
                </div>
            `;
        }).join('');

        historyContainer.innerHTML = historyHTML;
    }

    displayMoodCalendar() {
        const calendarContainer = document.getElementById('moodCalendar');
        const moodHistory = window.moodManager.moodHistory;
        
        // Create calendar for current month
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        let calendarHTML = '<div class="calendar-header">';
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            calendarHTML += `<div class="calendar-day-header">${day}</div>`;
        });
        calendarHTML += '</div><div class="calendar-grid">';

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toDateString();
            const mood = moodHistory.find(m => m.date === dateStr);
            const moodClass = mood ? mood.mood : '';
            const isToday = date.toDateString() === now.toDateString();
            
            calendarHTML += `
                <div class="calendar-day ${moodClass} ${isToday ? 'today' : ''}" 
                     title="${mood ? `Mood: ${mood.mood}` : 'No mood recorded'}">
                    ${day}
                    ${mood ? `<span class="mood-indicator">${mood.emoji}</span>` : ''}
                </div>
            `;
        }

        calendarHTML += '</div>';
        calendarContainer.innerHTML = calendarHTML;
    }

    displayWeeklySummary() {
        const summaryContainer = document.getElementById('weeklySummary');
        const stats = this.calculateWeeklyStats();
        
        if (!stats) {
            summaryContainer.innerHTML = '<p class="empty-state">Complete some entries to see your weekly summary!</p>';
            return;
        }

        const summaryHTML = `
            <div class="summary-item">
                <div class="summary-label">Average Mood</div>
                <div class="summary-value">
                    ${stats.averageMood.emoji} ${stats.averageMood.name}
                    <div class="mood-bar">
                        <div class="mood-fill" style="width: ${(stats.averageMood.score / 5) * 100}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="summary-item">
                <div class="summary-label">Most Common Themes</div>
                <div class="summary-value">
                    ${stats.commonThemes.slice(0, 3).map(theme => 
                        `<span class="theme-tag">${theme}</span>`
                    ).join('')}
                </div>
            </div>
            
            <div class="summary-item">
                <div class="summary-label">Journaling Consistency</div>
                <div class="summary-value">
                    ${stats.activeDays}/7 days active
                    <div class="consistency-bar">
                        <div class="consistency-fill" style="width: ${(stats.activeDays / 7) * 100}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="summary-item">
                <div class="summary-label">Growth Note</div>
                <div class="summary-value growth-note">
                    ${stats.growthNote}
                </div>
            </div>
        `;

        summaryContainer.innerHTML = summaryHTML;
    }

    displayAchievements() {
        const achievementsContainer = document.getElementById('achievements');
        const stats = this.getUserStats();
        
        const achievementsHTML = this.achievements.map(achievement => {
            const isUnlocked = achievement.condition(stats);
            
            return `
                <div class="achievement ${isUnlocked ? 'unlocked' : ''}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                    ${isUnlocked ? '<div class="achievement-unlocked">✓</div>' : ''}
                </div>
            `;
        }).join('');

        achievementsContainer.innerHTML = achievementsHTML;
    }

    calculateWeeklyStats() {
        const user = window.authManager.getCurrentUser();
        if (!user) return null;

        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // Get entries from last 7 days
        const entries = window.journalManager.getUserEntries().filter(entry => 
            new Date(entry.createdAt) >= weekAgo
        );
        
        const moods = window.moodManager.moodHistory.filter(mood => 
            new Date(mood.timestamp) >= weekAgo
        );

        if (entries.length === 0 && moods.length === 0) return null;

        // Calculate average mood
        const moodValues = {
            happy: { score: 5, name: 'Happy', emoji: '😊' },
            neutral: { score: 3, name: 'Neutral', emoji: '😐' },
            sad: { score: 1, name: 'Sad', emoji: '🙁' },
            anxious: { score: 2, name: 'Anxious', emoji: '😰' },
            angry: { score: 1.5, name: 'Angry', emoji: '😤' },
            tired: { score: 2.5, name: 'Tired', emoji: '😴' }
        };

        const allMoods = [...entries.filter(e => e.mood).map(e => e.mood), ...moods.map(m => m.mood)];
        const averageScore = allMoods.length > 0 
            ? allMoods.reduce((sum, mood) => sum + (moodValues[mood]?.score || 3), 0) / allMoods.length
            : 3;
        
        const averageMoodKey = Object.keys(moodValues).reduce((a, b) => 
            Math.abs(moodValues[a].score - averageScore) < Math.abs(moodValues[b].score - averageScore) ? a : b
        );

        // Extract common themes from journal entries
        const commonThemes = this.extractThemes(entries);

        // Count active days
        const activeDays = new Set();
        entries.forEach(entry => {
            activeDays.add(new Date(entry.createdAt).toDateString());
        });
        moods.forEach(mood => {
            activeDays.add(new Date(mood.timestamp).toDateString());
        });

        // Generate growth note
        const growthNote = this.generateGrowthNote(entries, moods, activeDays.size);

        return {
            averageMood: moodValues[averageMoodKey],
            commonThemes: commonThemes,
            activeDays: activeDays.size,
            growthNote: growthNote
        };
    }

    extractThemes(entries) {
        const commonWords = ['work', 'family', 'health', 'relationships', 'stress', 'anxiety', 'happiness', 'goals', 'friends', 'love', 'career', 'money', 'exercise', 'sleep', 'food'];
        const themes = {};
        
        entries.forEach(entry => {
            const words = entry.text.toLowerCase().split(/\s+/);
            commonWords.forEach(word => {
                if (words.some(w => w.includes(word))) {
                    themes[word] = (themes[word] || 0) + 1;
                }
            });
        });

        return Object.keys(themes)
            .sort((a, b) => themes[b] - themes[a])
            .slice(0, 5);
    }

    generateGrowthNote(entries, moods, activeDays) {
        const notes = [
            "You're building a consistent journaling habit - keep it up!",
            "Your self-reflection is deepening with each entry.",
            "You're becoming more aware of your emotional patterns.",
            "Your writing shows increasing emotional intelligence.",
            "You're developing better coping strategies through reflection.",
            "Your mindfulness practice is growing stronger.",
            "You're creating a valuable record of your personal growth.",
            "Your commitment to mental health is inspiring.",
            "You're learning to process emotions in healthy ways.",
            "Your self-awareness is expanding through regular reflection."
        ];

        if (activeDays >= 5) {
            return "Excellent consistency this week! You're really committed to your mental health journey.";
        } else if (activeDays >= 3) {
            return "Good progress this week! You're building a solid foundation for self-reflection.";
        } else if (entries.length > 0 || moods.length > 0) {
            return "Every entry counts! You're taking important steps toward better mental health.";
        }

        return notes[Math.floor(Math.random() * notes.length)];
    }

    getUserStats() {
        const user = window.authManager.getCurrentUser();
        if (!user) return {};

        const entries = window.journalManager.getUserEntries();
        const moods = window.moodManager.moodHistory;
        
        // Calculate streak
        const allEntries = [...entries, ...moods];
        const uniqueDates = new Set();
        allEntries.forEach(entry => {
            const date = new Date(entry.createdAt || entry.timestamp).toDateString();
            uniqueDates.add(date);
        });

        const currentStreak = this.calculateStreak(Array.from(uniqueDates));
        
        // Count long entries (500+ words)
        const longEntries = entries.filter(entry => 
            entry.text.split(/\s+/).length >= 500
        ).length;

        return {
            totalEntries: entries.length,
            moodEntries: moods.length,
            currentStreak: currentStreak,
            longEntries: longEntries,
            totalDays: uniqueDates.size
        };
    }

    calculateStreak(dates) {
        if (dates.length === 0) return 0;

        const sortedDates = dates.sort((a, b) => new Date(b) - new Date(a));
        const today = new Date().toDateString();
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

    getMoodEmoji(mood) {
        const emojis = {
            happy: '😊',
            neutral: '😐',
            sad: '🙁',
            anxious: '😰',
            angry: '😤',
            tired: '😴'
        };
        return emojis[mood] || '';
    }

    viewEntry(entryId) {
        const entries = window.journalManager.getUserEntries();
        const entry = entries.find(e => e.id === entryId);
        
        if (!entry) return;

        // Create modal to view entry
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <span class="close">&times;</span>
                <h3>Journal Entry</h3>
                <div class="entry-meta">
                    <p><strong>Date:</strong> ${new Date(entry.createdAt).toLocaleDateString()}</p>
                    ${entry.templateTitle ? `<p><strong>Template:</strong> ${entry.templateTitle}</p>` : ''}
                    ${entry.mood ? `<p><strong>Mood:</strong> ${this.getMoodEmoji(entry.mood)} ${entry.mood}</p>` : ''}
                    <p><strong>Word Count:</strong> ${entry.wordCount || 'N/A'}</p>
                </div>
                <div class="entry-content">
                    ${entry.text.replace(/\n/g, '<br>')}
                </div>
                ${entry.imageData ? `<div class="entry-image"><img src="${entry.imageData.data}" alt="Entry image" style="max-width: 100%; border-radius: 8px;"></div>` : ''}
                ${entry.aiResponse ? `
                    <div class="entry-ai-response">
                        <h4>AI Insights</h4>
                        <p>${entry.aiResponse}</p>
                    </div>
                ` : ''}
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'flex';

        // Close modal
        modal.querySelector('.close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    exportData() {
        const user = window.authManager.getCurrentUser();
        if (!user) return;

        const data = {
            user: {
                id: user.id,
                name: user.name,
                exportDate: new Date().toISOString()
            },
            entries: window.journalManager.getUserEntries(),
            moods: window.moodManager.moodHistory,
            stats: this.getUserStats(),
            achievements: this.achievements.filter(achievement => 
                achievement.condition(this.getUserStats())
            )
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mindjourney-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        window.authManager.showSuccess('Data exported successfully!');
    }
}

// Initialize insights manager
window.insightsManager = new InsightsManager();
