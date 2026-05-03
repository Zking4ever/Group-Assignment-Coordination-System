const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../utils/database');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const userCopy = { ...user };
      delete userCopy.password;
      res.json([userCopy]);
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, username } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  const id = uuidv4();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    db.prepare('INSERT INTO users (id, firstName, lastName, email, password, username) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, firstName, lastName, email, hashedPassword, username);
    
    res.status(201).json({ id, firstName, lastName, email, username });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      res.status(400).json({ error: 'Email or username already exists' });
    } else {
      res.status(400).json({ error: 'Registration failed: ' + err.message });
    }
  }
});

router.patch('/user/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const keys = Object.keys(updates);
  const setClause = keys.map(key => `${key} = ?`).join(', ');
  const values = keys.map(key => updates[key]);

  try {
    db.prepare(`UPDATE users SET ${setClause} WHERE id = ?`).run(...values, id);
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
