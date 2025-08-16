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
            password TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            settings TEXT
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

    const journalDraftsTable = `
        CREATE TABLE IF NOT EXISTS journal_drafts (
            userId TEXT PRIMARY KEY,
            text TEXT,
            template TEXT,
            timestamp TEXT,
            imageData TEXT,
            FOREIGN KEY (userId) REFERENCES users (id)
        );
    `;

    db.serialize(() => {
        db.run(usersTable, (err) => {
            if (err) console.error("Error creating users table", err.message);
            else console.log("Users table created or already exists.");
        });
        db.run(journalEntriesTable, (err) => {
            if (err) console.error("Error creating journal_entries table", err.message);
            else console.log("Journal entries table created or already exists.");
        });
        db.run(moodEntriesTable, (err) => {
            if (err) console.error("Error creating mood_entries table", err.message);
            else console.log("Mood entries table created or already exists.");
        });
        db.run(journalDraftsTable, (err) => {
            if (err) console.error("Error creating journal_drafts table", err.message);
            else console.log("Journal drafts table created or already exists.");
        });
    });
}

module.exports = db;
