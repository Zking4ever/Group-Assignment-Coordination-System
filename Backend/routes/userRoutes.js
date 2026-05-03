const express = require('express');
const router = express.Router();
const db = require('../utils/database');

router.get('/userdetail/:userId', (req, res) => {
  const { userId } = req.params;
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    delete user.password;
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
