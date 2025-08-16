const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../database');
const { randomUUID } = require('crypto');

// Get all mood entries for a user
router.get('/', auth, (req, res) => {
    db.all('SELECT * FROM mood_entries WHERE userId = ? ORDER BY timestamp DESC', [req.user.id], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.json(rows.map(row => ({...row, tags: JSON.parse(row.tags || '[]')})));
    });
});

// Create a new mood entry
router.post('/', auth, (req, res) => {
    const { mood, emoji, tags } = req.body;

    if (!mood) {
        return res.status(400).json({ message: 'Mood is required' });
    }

    const newEntry = {
        id: randomUUID(),
        userId: req.user.id,
        mood,
        emoji,
        tags: JSON.stringify(tags),
        timestamp: new Date().toISOString(),
        date: new Date().toDateString()
    };

    db.run(
        'INSERT INTO mood_entries (id, userId, mood, emoji, tags, timestamp, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [newEntry.id, newEntry.userId, newEntry.mood, newEntry.emoji, newEntry.tags, newEntry.timestamp, newEntry.date],
        function (err) {
            if (err) {
                return res.status(500).json({ message: 'Could not create mood entry', error: err.message });
            }
            res.status(201).json({...newEntry, tags: tags});
        }
    );
});

module.exports = router;
