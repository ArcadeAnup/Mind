const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const journalRoutes = require('./routes/journal');
app.use('/api/journal', journalRoutes);

const moodRoutes = require('./routes/mood');
app.use('/api/mood', moodRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('MindJourney Backend is running!');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
