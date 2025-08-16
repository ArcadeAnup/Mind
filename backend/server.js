const express = require('express');
const cors = require('cors');
const path = require('path');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const journalRoutes = require('./routes/journal');
const moodRoutes = require('./routes/mood');

app.use('/api/journal', journalRoutes);
app.use('/api/mood', moodRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('MindJourney Backend with Firebase and Gemini is running!');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
