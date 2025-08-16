// Journal System
class JournalManager {
    constructor() {
        this.currentEntry = null;
        this.templates = {
            daily: {
                title: "Daily Reflection",
                prompt: "How was your day? What went well? What was challenging? What are you grateful for today?"
            },
            anxiety: {
                title: "Anxiety Processing",
                prompt: "What am I worried about right now? What aspects can I control? What steps can I take to address my concerns?"
            },
            gratitude: {
                title: "Gratitude Practice",
                prompt: "What are three things I'm grateful for today? How did these things make me feel? Why are they meaningful to me?"
            },
            work: {
                title: "Work Stress",
                prompt: "What work challenges did I face today? How did I handle them? What could I do differently next time? What support do I need?"
            },
            goals: {
                title: "Goal Setting",
                prompt: "What do I want to achieve? What specific steps can I take? What obstacles might I face? How will I overcome them?"
            }
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateJournalDate();
        this.loadDraftEntry();
    }

    setupEventListeners() {
        // Template selector
        document.getElementById('templateSelect').addEventListener('change', (e) => {
            this.loadTemplate(e.target.value);
        });

        // Character counter
        document.getElementById('journalText').addEventListener('input', (e) => {
            this.updateCharCounter(e.target.value.length);
        });

        // Image attachment
        document.getElementById('attachImageBtn').addEventListener('click', () => {
            document.getElementById('imageInput').click();
        });

        document.getElementById('imageInput').addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files[0]);
        });

        // Save journal entry
        document.getElementById('saveJournalBtn').addEventListener('click', () => {
            this.saveEntry();
        });

        // Auto-save draft every 30 seconds
        setInterval(() => {
            this.saveDraft();
        }, 30000);
    }

    updateJournalDate() {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('journalDate').textContent = dateStr;
    }

    initializeWithTemplate(templateKey) {
        this.updateJournalDate();
        
        // Set journal title based on template
        const titles = {
            'daily': 'Daily Reflection',
            'anxiety': 'Anxiety Processing',
            'gratitude': 'Gratitude Practice',
            'work': 'Work Stress Journal',
            'goals': 'Goal Setting',
            '': 'Free Writing'
        };
        
        const titleElement = document.getElementById('journalTitle');
        if (titleElement) {
            titleElement.textContent = titles[templateKey] || 'Journal Entry';
        }

        // Load template prompts
        this.loadTemplatePrompt(templateKey);

        // Load existing draft if any
        this.loadDraftEntry();
    }

    loadTemplatePrompt(templateKey) {
        const promptElement = document.getElementById('templatePrompt');
        const textarea = document.getElementById('journalText');
        
        if (templateKey && this.templates[templateKey]) {
            const template = this.templates[templateKey];
            promptElement.innerHTML = `<p><strong>Reflection prompts:</strong> ${template.prompt}</p>`;
            promptElement.style.display = 'block';
            
            if (!textarea.value) {
                textarea.placeholder = template.prompt;
            }
        } else {
            promptElement.style.display = 'none';
            if (!textarea.value) {
                textarea.placeholder = "How are you feeling today? What's on your mind?";
            }
        }
    }

    loadTemplate(templateKey) {
        const promptElement = document.getElementById('templatePrompt');
        
        if (templateKey && this.templates[templateKey]) {
            const template = this.templates[templateKey];
            promptElement.textContent = template.prompt;
            promptElement.classList.add('active');
        } else {
            promptElement.classList.remove('active');
        }
    }

    updateCharCounter(count) {
        const counter = document.getElementById('charCounter');
        counter.textContent = `${count} characters`;
        
        // Add visual feedback for different lengths
        if (count > 500) {
            counter.style.color = 'var(--success-color)';
        } else if (count > 200) {
            counter.style.color = 'var(--primary-color)';
        } else {
            counter.style.color = 'var(--text-muted)';
        }
    }

    handleImageUpload(file) {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            window.authManager.showError('Please select a valid image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            window.authManager.showError('Image size must be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.displayImagePreview(e.target.result, file.name);
            // Store image data for saving
            this.currentImageData = {
                data: e.target.result,
                name: file.name,
                size: file.size
            };
        };
        reader.readAsDataURL(file);
    }

    displayImagePreview(imageSrc, fileName) {
        const previewContainer = document.getElementById('imagePreview');
        previewContainer.innerHTML = `
            <div class="image-preview-item">
                <img src="${imageSrc}" alt="${fileName}" style="max-width: 100%; max-height: 300px; border-radius: 8px;">
                <div class="image-info">
                    <span>${fileName}</span>
                    <button class="remove-image-btn" onclick="journalManager.removeImage()">
                        <i class="fas fa-times"></i> Remove
                    </button>
                </div>
            </div>
        `;
        previewContainer.classList.add('active');
    }

    removeImage() {
        document.getElementById('imagePreview').classList.remove('active');
        document.getElementById('imagePreview').innerHTML = '';
        this.currentImageData = null;
        document.getElementById('imageInput').value = '';
    }

    saveDraft() {
        const text = document.getElementById('journalText').value.trim();
        if (text.length > 0) {
            const draft = {
                text: text,
                template: document.getElementById('templateSelect').value,
                timestamp: new Date().toISOString(),
                imageData: this.currentImageData
            };
            localStorage.setItem('mindjourney_draft', JSON.stringify(draft));
        }
    }

    loadDraftEntry() {
        const draft = localStorage.getItem('mindjourney_draft');
        if (draft) {
            const draftData = JSON.parse(draft);
            const draftAge = Date.now() - new Date(draftData.timestamp).getTime();

            // Only load draft if it's less than 24 hours old
            if (draftAge < 24 * 60 * 60 * 1000) {
                document.getElementById('journalText').value = draftData.text;
                if (draftData.template) {
                    document.getElementById('templateSelect').value = draftData.template;
                    this.loadTemplate(draftData.template);
                }
                if (draftData.imageData) {
                    this.currentImageData = draftData.imageData;
                    this.displayImagePreview(draftData.imageData.data, draftData.imageData.name);
                }
                this.updateCharCounter(draftData.text.length);

                window.authManager.showInfo('Draft entry restored');
            }
        }
    }

    async saveEntry() {
        const text = document.getElementById('journalText').value.trim();
        const template = document.getElementById('templateSelect').value;

        if (text.length === 0) {
            window.authManager.showError('Please write something before saving');
            return;
        }

        const user = window.authManager.getCurrentUser();
        if (!user) {
            window.authManager.showError('Please log in to save entries');
            return;
        }

        // Create entry object
        const entry = {
            id: Date.now().toString(),
            userId: user.id,
            text: text,
            template: template,
            templateTitle: template ? this.templates[template]?.title : null,
            wordCount: text.split(/\s+/).length,
            charCount: text.length,
            imageData: this.currentImageData,
            createdAt: new Date().toISOString(),
            mood: null, // Will be set by AI analysis
            aiResponse: null,
            recommendations: null
        };

        // Save to localStorage
        const entries = JSON.parse(localStorage.getItem('mindjourney_entries') || '[]');
        entries.unshift(entry); // Add to beginning
        localStorage.setItem('mindjourney_entries', JSON.stringify(entries));

        // Update user stats
        this.updateUserStats();

        // Clear draft
        localStorage.removeItem('mindjourney_draft');

        // Show success message
        window.authManager.showSuccess('Journal entry saved successfully!');

        // Analyze mood and show AI response
        await this.analyzeEntry(entry);

        // Clear form
        this.clearForm();
    }

    async analyzeEntry(entry) {
        // Show loading state
        const aiResponseEl = document.getElementById('aiResponse');
        const recommendationsEl = document.getElementById('recommendations');

        aiResponseEl.style.display = 'block';
        aiResponseEl.innerHTML = '<div class="loading">Analyzing your entry...</div>';

        try {
            // Simulate AI analysis (in real app, this would be an API call)
            await new Promise(resolve => setTimeout(resolve, 2000));

            const analysis = this.performMoodAnalysis(entry.text);
            entry.mood = analysis.mood;
            entry.aiResponse = analysis.response;
            entry.recommendations = analysis.recommendations;

            // Update stored entry
            const entries = JSON.parse(localStorage.getItem('mindjourney_entries') || '[]');
            const entryIndex = entries.findIndex(e => e.id === entry.id);
            if (entryIndex !== -1) {
                entries[entryIndex] = entry;
                localStorage.setItem('mindjourney_entries', JSON.stringify(entries));
            }

            // Display AI response
            this.displayAIResponse(analysis);
            this.displayRecommendations(analysis.recommendations);

        } catch (error) {
            aiResponseEl.innerHTML = '<div class="error">Unable to analyze entry at this time.</div>';
        }
    }

    performMoodAnalysis(text) {
        const lowerText = text.toLowerCase();

        // Simple keyword-based mood analysis
        const moodKeywords = {
            happy: ['happy', 'joy', 'excited', 'great', 'amazing', 'wonderful', 'fantastic', 'good', 'positive', 'grateful', 'blessed', 'love'],
            sad: ['sad', 'depressed', 'down', 'upset', 'crying', 'tears', 'lonely', 'empty', 'hopeless', 'disappointed'],
            anxious: ['anxious', 'worried', 'nervous', 'scared', 'fear', 'panic', 'stress', 'overwhelmed', 'uncertain', 'concerned'],
            angry: ['angry', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated', 'rage', 'hate', 'bitter'],
            tired: ['tired', 'exhausted', 'drained', 'weary', 'sleepy', 'fatigue', 'worn out'],
            neutral: ['okay', 'fine', 'normal', 'regular', 'usual']
        };

        let moodScores = {};
        Object.keys(moodKeywords).forEach(mood => {
            moodScores[mood] = 0;
            moodKeywords[mood].forEach(keyword => {
                const matches = (lowerText.match(new RegExp(keyword, 'g')) || []).length;
                moodScores[mood] += matches;
            });
        });

        // Determine primary mood
        const primaryMood = Object.keys(moodScores).reduce((a, b) =>
            moodScores[a] > moodScores[b] ? a : b
        );

        // Generate response and recommendations
        const responses = this.generateMoodResponse(primaryMood, text);

        return {
            mood: primaryMood,
            response: responses.response,
            affirmation: responses.affirmation,
            recommendations: responses.recommendations
        };
    }

    generateMoodResponse(mood, text) {
        const responses = {
            happy: {
                response: "It's wonderful to see you feeling so positive! Your joy and gratitude really shine through in your writing. These moments of happiness are precious - they're building blocks for resilience and well-being.",
                affirmation: "I embrace joy and let positive moments fill my heart with gratitude.",
                recommendations: {
                    movies: [
                        { title: "The Pursuit of Happyness", description: "An inspiring story about resilience and never giving up on dreams" },
                        { title: "Inside Out", description: "A beautiful exploration of emotions and the importance of joy" }
                    ],
                    music: [
                        { title: "Good as Hell by Lizzo", description: "Empowering and energetic anthem for self-love" },
                        { title: "Happy by Pharrell Williams", description: "Pure joy in musical form" }
                    ],
                    quotes: [
                        { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
                        { text: "The most wasted of days is one without laughter.", author: "E.E. Cummings" }
                    ]
                }
            },
            sad: {
                response: "I can sense you're going through a difficult time right now. It's completely okay to feel sad - these emotions are valid and part of the human experience. Remember that this feeling is temporary, and you have the strength to work through it.",
                affirmation: "I allow myself to feel deeply, knowing that sadness will pass and I will find light again.",
                recommendations: {
                    movies: [
                        { title: "Inside Out", description: "Helps understand and process complex emotions" },
                        { title: "The Pursuit of Happyness", description: "A reminder that difficult times can lead to better days" }
                    ],
                    music: [
                        { title: "Breathe Me by Sia", description: "A gentle song about vulnerability and healing" },
                        { title: "The Night We Met by Lord Huron", description: "Melancholic but beautiful, helps process sadness" }
                    ],
                    quotes: [
                        { text: "The wound is the place where the Light enters you.", author: "Rumi" },
                        { text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" }
                    ]
                }
            },
            anxious: {
                response: "I can feel the worry and uncertainty in your words. Anxiety can be overwhelming, but remember that you've handled difficult situations before. Take some deep breaths and focus on what you can control right now.",
                affirmation: "I breathe deeply and focus on the present moment. I have the strength to handle whatever comes my way.",
                recommendations: {
                    movies: [
                        { title: "My Neighbor Totoro", description: "Peaceful and calming animation that soothes anxiety" },
                        { title: "A Silent Voice", description: "Beautiful story about overcoming anxiety and finding connection" }
                    ],
                    music: [
                        { title: "Weightless by Marconi Union", description: "Scientifically proven to reduce anxiety by 65%" },
                        { title: "Clair de Lune by Debussy", description: "Classical piece known for its calming effects" }
                    ],
                    quotes: [
                        { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
                        { text: "Anxiety is the dizziness of freedom.", author: "Søren Kierkegaard" }
                    ]
                }
            },
            angry: {
                response: "I can sense your frustration and anger. These are powerful emotions that show you care deeply about something. It's important to acknowledge these feelings while finding healthy ways to process and channel them.",
                affirmation: "I acknowledge my anger and use its energy to create positive change in my life.",
                recommendations: {
                    movies: [
                        { title: "Anger Management", description: "A comedy that helps put anger in perspective" },
                        { title: "The Karate Kid", description: "About channeling emotions into discipline and growth" }
                    ],
                    music: [
                        { title: "Stronger by Kelly Clarkson", description: "Empowering song about overcoming challenges" },
                        { title: "Fight Song by Rachel Platten", description: "Channeling anger into determination" }
                    ],
                    quotes: [
                        { text: "Holding on to anger is like grasping a hot coal with the intent of throwing it at someone else; you are the one who gets burned.", author: "Buddha" },
                        { text: "For every minute you remain angry, you give up sixty seconds of peace of mind.", author: "Ralph Waldo Emerson" }
                    ]
                }
            },
            tired: {
                response: "It sounds like you're feeling drained and exhausted. This is your body and mind telling you that rest is needed. Be gentle with yourself and remember that taking time to recharge is not selfish - it's necessary.",
                affirmation: "I honor my need for rest and give myself permission to recharge and restore my energy.",
                recommendations: {
                    movies: [
                        { title: "Kiki's Delivery Service", description: "Gentle story about finding balance and overcoming burnout" },
                        { title: "The Secret Garden", description: "Peaceful and restorative story about healing" }
                    ],
                    music: [
                        { title: "Spa Music", description: "Relaxing ambient sounds for rest and restoration" },
                        { title: "Sleep Baby Sleep by Broods", description: "Soothing song perfect for winding down" }
                    ],
                    quotes: [
                        { text: "Rest when you're weary. Refresh and renew yourself, your body, your mind, your spirit.", author: "Ralph Marston" },
                        { text: "Take time to make your soul happy.", author: "Unknown" }
                    ]
                }
            },
            neutral: {
                response: "You seem to be in a balanced, reflective state today. Sometimes these neutral moments are just as valuable as the highs and lows - they give us space to process and simply be present with ourselves.",
                affirmation: "I find peace in stillness and appreciate the calm moments in my journey.",
                recommendations: {
                    movies: [
                        { title: "Lost in Translation", description: "Contemplative film about finding meaning in quiet moments" },
                        { title: "Her", description: "Thoughtful exploration of human connection and self-reflection" }
                    ],
                    music: [
                        { title: "Mad World by Gary Jules", description: "Contemplative and introspective" },
                        { title: "The Scientist by Coldplay", description: "Reflective and emotionally balanced" }
                    ],
                    quotes: [
                        { text: "In the midst of winter, I found there was, within me, an invincible summer.", author: "Albert Camus" },
                        { text: "The quieter you become, the more you are able to hear.", author: "Rumi" }
                    ]
                }
            }
        };

        return responses[mood] || responses.neutral;
    }

    displayAIResponse(analysis) {
        const aiResponseEl = document.getElementById('aiResponse');
        const affirmationEl = document.getElementById('personalizedAffirmation');
        
        document.getElementById('aiResponseText').innerHTML = `
            <p><strong>Detected Mood:</strong> ${analysis.mood.charAt(0).toUpperCase() + analysis.mood.slice(1)}</p>
            <p>${analysis.response}</p>
        `;
        
        affirmationEl.innerHTML = `
            <strong>Your Personal Affirmation:</strong><br>
            "${analysis.affirmation}"
        `;
    }

    displayRecommendations(recommendations) {
        const recommendationsEl = document.getElementById('recommendations');
        recommendationsEl.style.display = 'block';

        // Movies
        const movieContent = recommendations.movies.map(movie => `
            <div class="rec-item">
                <h5>${movie.title}</h5>
                <p>${movie.description}</p>
            </div>
        `).join('');
        document.getElementById('movieRecs').innerHTML = movieContent;

        // Music
        const musicContent = recommendations.music.map(song => `
            <div class="rec-item">
                <h5>${song.title}</h5>
                <p>${song.description}</p>
            </div>
        `).join('');
        document.getElementById('musicRecs').innerHTML = musicContent;

        // Quotes
        const quoteContent = recommendations.quotes.map(quote => `
            <div class="rec-item">
                <h5>"${quote.text}"</h5>
                <p>- ${quote.author}</p>
            </div>
        `).join('');
        document.getElementById('quoteRecs').innerHTML = quoteContent;

        // Setup recommendation tabs
        this.setupRecommendationTabs();
    }

    setupRecommendationTabs() {
        const tabs = document.querySelectorAll('.rec-tab');
        const contents = document.querySelectorAll('.rec-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;

                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                contents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${targetTab}Recs`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    updateUserStats() {
        const user = window.authManager.getCurrentUser();
        if (!user) return;

        const entries = JSON.parse(localStorage.getItem('mindjourney_entries') || '[]');
        const userEntries = entries.filter(entry => entry.userId === user.id);

        // Update total entries
        document.getElementById('totalEntries').textContent = userEntries.length;

        // Calculate streak
        const streak = this.calculateStreak(userEntries);
        document.getElementById('currentStreak').textContent = streak;

        // Update current mood based on latest entry
        if (userEntries.length > 0 && userEntries[0].mood) {
            const moodDisplay = userEntries[0].mood.charAt(0).toUpperCase() + userEntries[0].mood.slice(1);
            document.getElementById('currentMood').textContent = moodDisplay;
        }
    }

    calculateStreak(entries) {
        if (entries.length === 0) return 0;

        let streak = 0;
        const today = new Date();
        const sortedEntries = entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        for (let i = 0; i < sortedEntries.length; i++) {
            const entryDate = new Date(sortedEntries[i].createdAt);
            const daysDiff = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));

            if (daysDiff === i) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    clearForm() {
        document.getElementById('journalText').value = '';
        document.getElementById('templateSelect').value = '';
        document.getElementById('templatePrompt').classList.remove('active');
        this.removeImage();
        this.updateCharCounter(0);
        document.getElementById('aiResponse').style.display = 'none';
        document.getElementById('recommendations').style.display = 'none';
    }

    getUserEntries(userId = null) {
        const user = userId || window.authManager.getCurrentUser()?.id;
        if (!user) return [];

        const entries = JSON.parse(localStorage.getItem('mindjourney_entries') || '[]');
        return entries.filter(entry => entry.userId === user);
    }
}

// Initialize journal manager
window.journalManager = new JournalManager();
