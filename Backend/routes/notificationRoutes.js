const express = require('express');
const router = express.Router();
const db = require('../utils/database');

router.get('/:groupId', (req, res) => {
  const { groupId } = req.params;
  try {
    const notifs = db.prepare('SELECT * FROM notifications WHERE groupId = ? ORDER BY createdAt DESC LIMIT 20').all(groupId);
    res.json(notifs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
