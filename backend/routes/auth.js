const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { randomUUID } = require('crypto');

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || 'a-very-secret-key';

// Register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check if user exists
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = {
            id: randomUUID(),
            name: name || 'User',
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            settings: JSON.stringify({ theme: 'light', colorScheme: 'blue', textSize: 'medium' })
        };

        db.run(
            'INSERT INTO users (id, name, email, password, createdAt, settings) VALUES (?, ?, ?, ?, ?, ?)',
            [newUser.id, newUser.name, newUser.email, newUser.password, newUser.createdAt, newUser.settings],
            function (err) {
                if (err) {
                    return res.status(500).json({ message: 'Could not create user', error: err.message });
                }

                // Create and sign token
                const token = jwt.sign({ id: newUser.id }, jwtSecret, { expiresIn: '1h' });
                res.status(201).json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
            }
        );
    });
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create and sign token
        const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, settings: JSON.parse(user.settings || '{}') } });
    });
});

module.exports = router;
