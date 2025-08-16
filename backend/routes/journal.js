const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../database');
const multer = require('multer');
const path = require('path');
const { randomUUID } = require('crypto');

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'backend/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Get all journal entries for a user
router.get('/', auth, (req, res) => {
    db.all('SELECT * FROM journal_entries WHERE userId = ? ORDER BY createdAt DESC', [req.user.id], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.json(rows.map(row => ({...row, recommendations: JSON.parse(row.recommendations || '{}')})));
    });
});

// Create a new journal entry
router.post('/', auth, upload.single('image'), (req, res) => {
    const { text, template, templateTitle } = req.body;
    const imageData = req.file ? `/uploads/${req.file.filename}` : null;

    if (!text) {
        return res.status(400).json({ message: 'Journal text is required' });
    }

    // Simulate AI analysis
    const analysis = performMoodAnalysis(text);

    const newEntry = {
        id: randomUUID(),
        userId: req.user.id,
        text,
        template,
        templateTitle,
        wordCount: text.split(/\s+/).length,
        charCount: text.length,
        imageData,
        createdAt: new Date().toISOString(),
        mood: analysis.mood,
        aiResponse: analysis.response,
        recommendations: JSON.stringify(analysis.recommendations)
    };

    db.run(
        'INSERT INTO journal_entries (id, userId, text, template, templateTitle, wordCount, charCount, imageData, createdAt, mood, aiResponse, recommendations) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [newEntry.id, newEntry.userId, newEntry.text, newEntry.template, newEntry.templateTitle, newEntry.wordCount, newEntry.charCount, newEntry.imageData, newEntry.createdAt, newEntry.mood, newEntry.aiResponse, newEntry.recommendations],
        function (err) {
            if (err) {
                return res.status(500).json({ message: 'Could not create journal entry', error: err.message });
            }
            res.status(201).json({...newEntry, recommendations: analysis.recommendations});
        }
    );
});

// AI analysis simulation placeholder
function performMoodAnalysis(text) {
    const lowerText = text.toLowerCase();

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

    const primaryMood = Object.keys(moodScores).reduce((a, b) =>
        moodScores[a] > moodScores[b] ? a : b
    );

    const responses = generateMoodResponse(primaryMood, text);

    return {
        mood: primaryMood,
        response: responses.response,
        affirmation: responses.affirmation,
        recommendations: responses.recommendations
    };
}

function generateMoodResponse(mood, text) {
    const responses = {
        happy: {
            response: "It's wonderful to see you feeling so positive! Your joy and gratitude really shine through in your writing. These moments of happiness are precious - they're building blocks for resilience and well-being.",
            affirmation: "I embrace joy and let positive moments fill my heart with gratitude.",
            recommendations: { movies: [], music: [], quotes: [] }
        },
        sad: {
            response: "I can sense you're going through a difficult time right now. It's completely okay to feel sad - these emotions are valid and part of the human experience. Remember that this feeling is temporary, and you have the strength to work through it.",
            affirmation: "I allow myself to feel deeply, knowing that sadness will pass and I will find light again.",
            recommendations: { movies: [], music: [], quotes: [] }
        },
        anxious: {
            response: "I can feel the worry and uncertainty in your words. Anxiety can be overwhelming, but remember that you've handled difficult situations before. Take some deep breaths and focus on what you can control right now.",
            affirmation: "I breathe deeply and focus on the present moment. I have the strength to handle whatever comes my way.",
            recommendations: { movies: [], music: [], quotes: [] }
        },
        angry: {
            response: "I can sense your frustration and anger. These are powerful emotions that show you care deeply about something. It's important to acknowledge these feelings while finding healthy ways to process and channel them.",
            affirmation: "I acknowledge my anger and use its energy to create positive change in my life.",
            recommendations: { movies: [], music: [], quotes: [] }
        },
        tired: {
            response: "It sounds like you're feeling drained and exhausted. This is your body and mind telling you that rest is needed. Be gentle with yourself and remember that taking time to recharge is not selfish - it's necessary.",
            affirmation: "I honor my need for rest and give myself permission to recharge and restore my energy.",
            recommendations: { movies: [], music: [], quotes: [] }
        },
        neutral: {
            response: "You seem to be in a balanced, reflective state today. Sometimes these neutral moments are just as valuable as the highs and lows - they give us space to process and simply be present with ourselves.",
            affirmation: "I find peace in stillness and appreciate the calm moments in my journey.",
            recommendations: { movies: [], music: [], quotes: [] }
        }
    };

    return responses[mood] || responses.neutral;
}

// Draft routes
router.get('/draft', auth, (req, res) => {
    db.get('SELECT * FROM journal_drafts WHERE userId = ?', [req.user.id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.json(row);
    });
});

router.post('/draft', auth, (req, res) => {
    const { text, template, imageData } = req.body;
    const draft = {
        userId: req.user.id,
        text,
        template,
        imageData: JSON.stringify(imageData),
        timestamp: new Date().toISOString()
    };

    db.run(
        'REPLACE INTO journal_drafts (userId, text, template, imageData, timestamp) VALUES (?, ?, ?, ?, ?)',
        [draft.userId, draft.text, draft.template, draft.imageData, draft.timestamp],
        function (err) {
            if (err) {
                return res.status(500).json({ message: 'Could not save draft', error: err.message });
            }
            res.status(200).json({ message: 'Draft saved' });
        }
    );
});

router.delete('/draft', auth, (req, res) => {
    db.run('DELETE FROM journal_drafts WHERE userId = ?', [req.user.id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Could not delete draft', error: err.message });
        }
        res.status(200).json({ message: 'Draft deleted' });
    });
});


module.exports = router;
