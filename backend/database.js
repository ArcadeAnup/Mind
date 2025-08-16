const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'mindjourney.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createTables();
    }
});

function createTables() {
    const usersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            createdAt TEXT NOT NULL
        );
    `;

    const journalEntriesTable = `
        CREATE TABLE IF NOT EXISTS journal_entries (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            text TEXT NOT NULL,
            template TEXT,
            templateTitle TEXT,
            wordCount INTEGER,
            charCount INTEGER,
            imageData TEXT,
            createdAt TEXT NOT NULL,
            mood TEXT,
            aiResponse TEXT,
            recommendations TEXT,
            FOREIGN KEY (userId) REFERENCES users (id)
        );
    `;

    const moodEntriesTable = `
        CREATE TABLE IF NOT EXISTS mood_entries (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            mood TEXT NOT NULL,
            emoji TEXT,
            tags TEXT,
            timestamp TEXT NOT NULL,
            date TEXT NOT NULL,
            FOREIGN KEY (userId) REFERENCES users (id)
        );
    `;

    db.serialize(() => {
        db.run(usersTable, (err) => {
            if (err) console.error("Error creating users table", err.message);
        });
        db.run(journalEntriesTable, (err) => {
            if (err) console.error("Error creating journal_entries table", err.message);
        });
        db.run(moodEntriesTable, (err) => {
            if (err) console.error("Error creating mood_entries table", err.message);
        });
    });
}

module.exports = db;
