# MindJourney - Mental Health Check-In App

A comprehensive journaling-focused mental health web application that provides users with daily emotional check-ins, AI-powered mood analysis, and personalized content recommendations to support mental wellness.

## Features

### 🔐 User Authentication
- Email/Password registration and login
- Google OAuth integration (simulated)
- Anonymous mode for privacy-conscious users
- Secure local data storage

### 📊 Dashboard
- Daily motivational quotes
- Current streak tracking
- Mood overview with visual charts
- Quick access to journaling and mood check-ins

### ✍️ Journaling System
- Free-form text editor with character counter
- Pre-built templates for different scenarios:
  - Daily Reflection
  - Anxiety Processing
  - Gratitude Practice
  - Work Stress
  - Goal Setting
- Image attachment support
- Auto-save drafts
- AI-powered mood analysis

### 😊 Mood Tracking
- Quick 10-second mood check-ins
- 6 primary emotions with emoji interface
- Context tags (work, family, health, etc.)
- Visual mood calendar
- 7-day mood trend charts

### 🤖 AI Features
- Mood detection from journal text
- Empathetic AI responses
- Personalized affirmations
- Content recommendations based on mood

### 🎬 Content Recommendations
- **Movies**: Curated films for each mood
- **Music**: Songs and playlists for emotional support
- **Quotes**: Inspirational quotes from famous authors
- Genre tags and descriptions for all content

### 📈 Analytics & Insights
- Journal entry history with search
- Monthly mood calendar
- Weekly summaries with growth notes
- Achievement system with badges
- Pattern recognition and trends

### 🏆 Gamification
- Daily journaling streaks
- Achievement badges:
  - First Steps (1 entry)
  - Week Warrior (7-day streak)
  - Monthly Mindfulness (30-day streak)
  - Deep Thinker (10 detailed entries)
  - Mood Tracker (30 mood check-ins)
- Success stories for motivation

### ⚙️ Settings & Privacy
- Light/Dark theme toggle
- Color scheme options (Blue, Green, Purple)
- Text size accessibility options
- Anonymous mode
- Data export/import functionality

## Technical Features

### 🎨 Modern UI/UX
- Responsive design for all devices
- Smooth animations and transitions
- Accessible color schemes
- Clean, minimalist interface
- Mobile-first approach

### 💾 Data Management
- Local storage for privacy
- Auto-backup every 5 minutes
- Complete data export (JSON)
- Draft auto-save
- Data restoration capabilities

### ⌨️ Keyboard Shortcuts
- `Ctrl+1`: Dashboard
- `Ctrl+2`: Journal
- `Ctrl+3`: Insights
- `Ctrl+S`: Save journal entry
- `Ctrl+E`: Export data
- `M`: Quick mood check

## Getting Started

1. **Open the App**: Simply open `index.html` in a modern web browser
2. **Create Account**: Register with email/password, Google, or use anonymous mode
3. **Start Journaling**: Write your first entry using templates or free-form
4. **Track Mood**: Use quick mood check-ins to build emotional awareness
5. **Explore Insights**: View your progress, achievements, and patterns

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Privacy & Security

- All data stored locally in browser
- No server communication required
- Anonymous mode available
- User controls all data export/deletion
- GDPR-friendly design

## File Structure

```
MindJourney/
├── index.html              # Main application file
├── styles/
│   └── main.css            # Complete styling system
├── js/
│   ├── auth.js             # Authentication management
│   ├── journal.js          # Journaling functionality
│   ├── mood.js             # Mood tracking system
│   ├── insights.js         # Analytics and achievements
│   ├── recommendations.js  # Content recommendation engine
│   └── main.js             # Main app controller
└── README.md               # This file
```

## Development

The app is built with vanilla JavaScript, HTML5, and CSS3 for maximum compatibility and performance. No build process required - simply open `index.html` in a browser.

### Key Classes
- `AuthManager`: Handles user authentication and sessions
- `JournalManager`: Manages journal entries and AI analysis
- `MoodManager`: Tracks mood data and generates charts
- `InsightsManager`: Provides analytics and achievements
- `RecommendationManager`: Curates content based on mood
- `MindJourneyApp`: Main application controller

## Future Enhancements

- Real AI integration (OpenAI, etc.)
- Cloud synchronization
- Mobile app versions
- Therapist sharing features
- Advanced analytics
- Community features
- Meditation integration

## License

This project is open source and available under the MIT License.

## Support

For support or feature requests, please create an issue in the project repository.

---

**MindJourney** - Your companion for mental health and emotional well-being. 🌟
