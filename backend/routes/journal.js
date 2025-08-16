const express = require('express');
const router = express.Router();
const firebaseAuth = require('../middleware/firebaseAuth');
const db = require('../database');
const multer = require('multer');
const path = require('path');
const { randomUUID } = require('crypto');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Gemini API setup - I have to hardcode this for the sandbox, in a real app use environment variables
const genAI = new GoogleGenerativeAI("AIzaSyAn_kTHl9b5DXX-CifMD4vYnZDwdjgS4Hc");

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
router.get('/', firebaseAuth, (req, res) => {
    db.all('SELECT * FROM journal_entries WHERE userId = ? ORDER BY createdAt DESC', [req.user.uid], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.json(rows.map(row => ({...row, recommendations: JSON.parse(row.recommendations || '{}')})));
    });
});

// Create a new journal entry
router.post('/', firebaseAuth, upload.single('image'), async (req, res) => {
    const { text, template, templateTitle } = req.body;
    const userId = req.user.uid;
    const imageData = req.file ? `/uploads/${req.file.filename}` : null;

    if (!text) {
        return res.status(400).json({ message: 'Journal text is required' });
    }

    try {
        // Get mood from Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Analyze the mood of the following journal entry. Respond with a single word from this list: happy, sad, anxious, angry, tired, neutral. Journal entry: "${text}"`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const mood = response.text().trim().toLowerCase();

        const newEntry = {
            id: randomUUID(),
            userId,
            text,
            template,
            templateTitle,
            wordCount: text.split(/\s+/).length,
            charCount: text.length,
            imageData,
            createdAt: new Date().toISOString(),
            mood: mood,
            aiResponse: "Mood analyzed by Gemini.", // Placeholder response
            recommendations: JSON.stringify({}), // Placeholder
        };

        db.run(
            'INSERT INTO journal_entries (id, userId, text, template, templateTitle, wordCount, charCount, imageData, createdAt, mood, aiResponse, recommendations) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [newEntry.id, newEntry.userId, newEntry.text, newEntry.template, newEntry.templateTitle, newEntry.wordCount, newEntry.charCount, newEntry.imageData, newEntry.createdAt, newEntry.mood, newEntry.aiResponse, newEntry.recommendations],
            function (err) {
                if (err) {
                    return res.status(500).json({ message: 'Could not create journal entry', error: err.message });
                }
                res.status(201).json(newEntry);
            }
        );

    } catch (error) {
        console.error('Error with Gemini API or database:', error);
        res.status(500).json({ message: 'Failed to create journal entry due to an external service error.' });
    }
});

module.exports = router;
