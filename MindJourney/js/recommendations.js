// Content Recommendation System
class RecommendationManager {
    constructor() {
        this.contentDatabase = {
            movies: {
                happy: [
                    { title: "The Pursuit of Happyness", description: "An inspiring story about resilience and never giving up on dreams", genre: "Drama/Biography" },
                    { title: "Inside Out", description: "A beautiful exploration of emotions and the importance of joy", genre: "Animation/Family" },
                    { title: "The Grand Budapest Hotel", description: "Whimsical and visually stunning comedy-drama", genre: "Comedy/Drama" },
                    { title: "Paddington", description: "Heartwarming family film about kindness and belonging", genre: "Family/Comedy" }
                ],
                sad: [
                    { title: "Inside Out", description: "Helps understand and process complex emotions", genre: "Animation/Family" },
                    { title: "The Pursuit of Happyness", description: "A reminder that difficult times can lead to better days", genre: "Drama/Biography" },
                    { title: "A Monster Calls", description: "Beautiful story about grief and healing", genre: "Drama/Fantasy" },
                    { title: "Good Will Hunting", description: "About overcoming trauma and finding hope", genre: "Drama" }
                ],
                anxious: [
                    { title: "My Neighbor Totoro", description: "Peaceful and calming animation that soothes anxiety", genre: "Animation/Family" },
                    { title: "A Silent Voice", description: "Beautiful story about overcoming anxiety and finding connection", genre: "Animation/Drama" },
                    { title: "The Secret Garden", description: "Gentle story about healing and growth", genre: "Family/Drama" },
                    { title: "Spirited Away", description: "Magical journey that promotes courage and self-discovery", genre: "Animation/Adventure" }
                ],
                angry: [
                    { title: "Anger Management", description: "A comedy that helps put anger in perspective", genre: "Comedy" },
                    { title: "The Karate Kid", description: "About channeling emotions into discipline and growth", genre: "Drama/Sport" },
                    { title: "Peaceful Warrior", description: "Philosophical journey about finding inner peace", genre: "Drama/Sport" },
                    { title: "Dead Poets Society", description: "Inspiring story about passion and self-expression", genre: "Drama" }
                ],
                tired: [
                    { title: "Kiki's Delivery Service", description: "Gentle story about finding balance and overcoming burnout", genre: "Animation/Family" },
                    { title: "The Secret Garden", description: "Peaceful and restorative story about healing", genre: "Family/Drama" },
                    { title: "My Neighbor Totoro", description: "Soothing and comforting animated film", genre: "Animation/Family" },
                    { title: "Little Women", description: "Warm family story about love and support", genre: "Drama/Romance" }
                ],
                neutral: [
                    { title: "Lost in Translation", description: "Contemplative film about finding meaning in quiet moments", genre: "Drama/Romance" },
                    { title: "Her", description: "Thoughtful exploration of human connection and self-reflection", genre: "Drama/Romance" },
                    { title: "The Before Trilogy", description: "Deep conversations about life and relationships", genre: "Drama/Romance" },
                    { title: "Midnight in Paris", description: "Whimsical exploration of art, life, and nostalgia", genre: "Comedy/Fantasy" }
                ]
            },
            music: {
                happy: [
                    { title: "Good as Hell by Lizzo", description: "Empowering and energetic anthem for self-love", genre: "Pop/R&B" },
                    { title: "Happy by Pharrell Williams", description: "Pure joy in musical form", genre: "Pop/Funk" },
                    { title: "Can't Stop the Feeling by Justin Timberlake", description: "Upbeat and infectious positivity", genre: "Pop/Dance" },
                    { title: "Walking on Sunshine by Katrina and the Waves", description: "Classic feel-good anthem", genre: "Pop/Rock" }
                ],
                sad: [
                    { title: "Breathe Me by Sia", description: "A gentle song about vulnerability and healing", genre: "Pop/Alternative" },
                    { title: "The Night We Met by Lord Huron", description: "Melancholic but beautiful, helps process sadness", genre: "Indie Folk" },
                    { title: "Mad World by Gary Jules", description: "Contemplative cover that validates deep emotions", genre: "Alternative/Indie" },
                    { title: "Hurt by Johnny Cash", description: "Powerful reflection on pain and redemption", genre: "Country/Alternative" }
                ],
                anxious: [
                    { title: "Weightless by Marconi Union", description: "Scientifically proven to reduce anxiety by 65%", genre: "Ambient/Electronic" },
                    { title: "Clair de Lune by Debussy", description: "Classical piece known for its calming effects", genre: "Classical" },
                    { title: "Aqueous Transmission by Incubus", description: "Long, meditative instrumental piece", genre: "Alternative Rock" },
                    { title: "River by Joni Mitchell", description: "Gentle and soothing folk ballad", genre: "Folk/Singer-Songwriter" }
                ],
                angry: [
                    { title: "Stronger by Kelly Clarkson", description: "Empowering song about overcoming challenges", genre: "Pop/Rock" },
                    { title: "Fight Song by Rachel Platten", description: "Channeling anger into determination", genre: "Pop/Rock" },
                    { title: "Roar by Katy Perry", description: "Anthem about finding your voice and strength", genre: "Pop" },
                    { title: "Titanium by David Guetta ft. Sia", description: "About resilience and inner strength", genre: "Electronic/Pop" }
                ],
                tired: [
                    { title: "Sleep Baby Sleep by Broods", description: "Soothing song perfect for winding down", genre: "Indie Pop" },
                    { title: "Holocene by Bon Iver", description: "Peaceful and introspective", genre: "Indie Folk" },
                    { title: "Spa Music Playlist", description: "Relaxing ambient sounds for rest and restoration", genre: "Ambient/New Age" },
                    { title: "Gymnopédie No. 1 by Erik Satie", description: "Minimalist classical piece for relaxation", genre: "Classical" }
                ],
                neutral: [
                    { title: "Mad World by Gary Jules", description: "Contemplative and introspective", genre: "Alternative/Indie" },
                    { title: "The Scientist by Coldplay", description: "Reflective and emotionally balanced", genre: "Alternative Rock" },
                    { title: "Skinny Love by Bon Iver", description: "Gentle and contemplative", genre: "Indie Folk" },
                    { title: "Black by Pearl Jam", description: "Deep and reflective rock ballad", genre: "Grunge/Alternative" }
                ]
            },
            quotes: {
                happy: [
                    { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
                    { text: "The most wasted of days is one without laughter.", author: "E.E. Cummings" },
                    { text: "Joy is not in things; it is in us.", author: "Richard Wagner" },
                    { text: "Happiness is when what you think, what you say, and what you do are in harmony.", author: "Mahatma Gandhi" }
                ],
                sad: [
                    { text: "The wound is the place where the Light enters you.", author: "Rumi" },
                    { text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
                    { text: "The darkest nights produce the brightest stars.", author: "John Green" },
                    { text: "Every storm runs out of rain.", author: "Maya Angelou" }
                ],
                anxious: [
                    { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
                    { text: "Anxiety is the dizziness of freedom.", author: "Søren Kierkegaard" },
                    { text: "Nothing in life is to be feared, it is only to be understood.", author: "Marie Curie" },
                    { text: "You have been assigned this mountain to show others it can be moved.", author: "Mel Robbins" }
                ],
                angry: [
                    { text: "Holding on to anger is like grasping a hot coal with the intent of throwing it at someone else; you are the one who gets burned.", author: "Buddha" },
                    { text: "For every minute you remain angry, you give up sixty seconds of peace of mind.", author: "Ralph Waldo Emerson" },
                    { text: "Anger is an acid that can do more harm to the vessel in which it is stored than to anything on which it is poured.", author: "Mark Twain" },
                    { text: "The best fighter is never angry.", author: "Lao Tzu" }
                ],
                tired: [
                    { text: "Rest when you're weary. Refresh and renew yourself, your body, your mind, your spirit.", author: "Ralph Marston" },
                    { text: "Take time to make your soul happy.", author: "Unknown" },
                    { text: "Sometimes the most productive thing you can do is relax.", author: "Mark Black" },
                    { text: "Your body is precious. It is our vehicle for awakening. Treat it with care.", author: "Buddha" }
                ],
                neutral: [
                    { text: "In the midst of winter, I found there was, within me, an invincible summer.", author: "Albert Camus" },
                    { text: "The quieter you become, the more you are able to hear.", author: "Rumi" },
                    { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
                    { text: "The present moment is the only time over which we have dominion.", author: "Thích Nhất Hạnh" }
                ]
            }
        };

        this.dailyQuotes = [
            { text: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.", author: "Alan Watts" },
            { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
            { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
            { text: "Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.", author: "Bill Keane" },
            { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
            { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
            { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
            { text: "Life is 10% what happens to you and 90% how you react to it.", author: "Charles R. Swindoll" },
            { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
            { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" }
        ];

        this.init();
    }

    init() {
        this.setDailyQuote();
    }

    setDailyQuote() {
        // Use date as seed for consistent daily quote
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const quoteIndex = dayOfYear % this.dailyQuotes.length;
        
        const quote = this.dailyQuotes[quoteIndex];
        document.getElementById('dailyQuote').textContent = `"${quote.text}"`;
        document.getElementById('quoteAuthor').textContent = `- ${quote.author}`;
    }

    getRecommendations(mood, count = 3) {
        if (!mood || !this.contentDatabase.movies[mood]) {
            mood = 'neutral';
        }

        const recommendations = {
            movies: this.getRandomItems(this.contentDatabase.movies[mood], count),
            music: this.getRandomItems(this.contentDatabase.music[mood], count),
            quotes: this.getRandomItems(this.contentDatabase.quotes[mood], Math.min(count, 2))
        };

        return recommendations;
    }

    getRandomItems(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    displayRecommendations(mood) {
        const recommendations = this.getRecommendations(mood);
        
        // Display movies
        const movieContent = recommendations.movies.map(movie => `
            <div class="rec-item">
                <h5>${movie.title}</h5>
                <p>${movie.description}</p>
                <span class="genre-tag">${movie.genre}</span>
            </div>
        `).join('');
        document.getElementById('movieRecs').innerHTML = movieContent;

        // Display music
        const musicContent = recommendations.music.map(song => `
            <div class="rec-item">
                <h5>${song.title}</h5>
                <p>${song.description}</p>
                <span class="genre-tag">${song.genre}</span>
            </div>
        `).join('');
        document.getElementById('musicRecs').innerHTML = musicContent;

        // Display quotes
        const quoteContent = recommendations.quotes.map(quote => `
            <div class="rec-item">
                <h5>"${quote.text}"</h5>
                <p>- ${quote.author}</p>
            </div>
        `).join('');
        document.getElementById('quoteRecs').innerHTML = quoteContent;

        // Show recommendations section
        document.getElementById('recommendations').style.display = 'block';
    }

    getSuccessStory() {
        const stories = [
            {
                title: "Overcoming Anxiety Through Journaling",
                content: "Sarah, a 28-year-old marketing professional, struggled with anxiety for years. After starting her journaling journey with MindJourney, she began to identify her anxiety triggers and develop coping strategies. Within three months, she reported feeling more in control of her emotions and better equipped to handle stressful situations at work.",
                theme: "anxiety"
            },
            {
                title: "Finding Balance in a Busy Life",
                content: "Mark, a father of two and business owner, felt overwhelmed by his responsibilities. Through daily reflection and mood tracking, he discovered patterns in his stress levels and learned to prioritize self-care. His consistent journaling practice helped him become more present with his family and more effective in his work.",
                theme: "work-stress"
            },
            {
                title: "Building Self-Confidence",
                content: "Emma, a college student, used journaling to work through feelings of self-doubt and imposter syndrome. By documenting her achievements and reflecting on her growth, she gradually built a stronger sense of self-worth. Her journal became a source of encouragement during challenging times.",
                theme: "self-confidence"
            },
            {
                title: "Navigating Life Transitions",
                content: "David used MindJourney during a major career change. The daily writing practice helped him process his fears about leaving his corporate job to pursue his passion for teaching. Looking back at his entries, he could see how his confidence grew over time, and the journal served as a record of his brave journey.",
                theme: "life-transitions"
            },
            {
                title: "Healing from Loss",
                content: "After losing her mother, Maria found it difficult to express her grief. Journaling provided a safe space to explore her emotions without judgment. Over time, her entries evolved from expressions of pain to memories of gratitude and love, helping her find a path toward healing.",
                theme: "grief"
            },
            {
                title: "Managing Depression",
                content: "Alex struggled with depression and found it hard to see progress in his mental health journey. Through consistent mood tracking and journaling, he began to notice small improvements and patterns. His journal became evidence of his resilience and a tool for communicating with his therapist.",
                theme: "depression"
            }
        ];

        // Return a random story or cycle through them based on the week
        const weekOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
        const storyIndex = weekOfYear % stories.length;
        return stories[storyIndex];
    }

    displaySuccessStory() {
        const story = this.getSuccessStory();
        
        const storyHTML = `
            <div class="success-story">
                <h4>${story.title}</h4>
                <p>${story.content}</p>
                <div class="story-theme">${story.theme.replace('-', ' ').toUpperCase()}</div>
            </div>
        `;

        // You can display this in a dedicated section or modal
        return storyHTML;
    }

    searchContent(query, type = 'all') {
        const results = {
            movies: [],
            music: [],
            quotes: []
        };

        const searchTerm = query.toLowerCase();

        if (type === 'all' || type === 'movies') {
            Object.values(this.contentDatabase.movies).flat().forEach(movie => {
                if (movie.title.toLowerCase().includes(searchTerm) || 
                    movie.description.toLowerCase().includes(searchTerm) ||
                    movie.genre.toLowerCase().includes(searchTerm)) {
                    results.movies.push(movie);
                }
            });
        }

        if (type === 'all' || type === 'music') {
            Object.values(this.contentDatabase.music).flat().forEach(song => {
                if (song.title.toLowerCase().includes(searchTerm) || 
                    song.description.toLowerCase().includes(searchTerm) ||
                    song.genre.toLowerCase().includes(searchTerm)) {
                    results.music.push(song);
                }
            });
        }

        if (type === 'all' || type === 'quotes') {
            Object.values(this.contentDatabase.quotes).flat().forEach(quote => {
                if (quote.text.toLowerCase().includes(searchTerm) || 
                    quote.author.toLowerCase().includes(searchTerm)) {
                    results.quotes.push(quote);
                }
            });
        }

        return results;
    }

    addCustomRecommendation(type, mood, item) {
        if (!this.contentDatabase[type] || !this.contentDatabase[type][mood]) {
            return false;
        }

        // Add to the database (in a real app, this would sync to a server)
        this.contentDatabase[type][mood].push(item);
        
        // Save to localStorage for persistence
        const customRecs = JSON.parse(localStorage.getItem('mindjourney_custom_recs') || '{}');
        if (!customRecs[type]) customRecs[type] = {};
        if (!customRecs[type][mood]) customRecs[type][mood] = [];
        customRecs[type][mood].push(item);
        localStorage.setItem('mindjourney_custom_recs', JSON.stringify(customRecs));

        return true;
    }

    loadCustomRecommendations() {
        const customRecs = JSON.parse(localStorage.getItem('mindjourney_custom_recs') || '{}');
        
        // Merge custom recommendations with default database
        Object.keys(customRecs).forEach(type => {
            if (this.contentDatabase[type]) {
                Object.keys(customRecs[type]).forEach(mood => {
                    if (this.contentDatabase[type][mood]) {
                        this.contentDatabase[type][mood] = [
                            ...this.contentDatabase[type][mood],
                            ...customRecs[type][mood]
                        ];
                    }
                });
            }
        });
    }

    exportRecommendations() {
        const user = window.authManager.getCurrentUser();
        if (!user) return null;

        const exportData = {
            userId: user.id,
            exportDate: new Date().toISOString(),
            customRecommendations: JSON.parse(localStorage.getItem('mindjourney_custom_recs') || '{}'),
            favoriteContent: JSON.parse(localStorage.getItem('mindjourney_favorites') || '[]')
        };

        return exportData;
    }
}

// Initialize recommendation manager
window.recommendationManager = new RecommendationManager();
