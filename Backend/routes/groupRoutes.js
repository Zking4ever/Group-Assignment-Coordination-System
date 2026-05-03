const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../utils/database');

router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const groups = db.prepare('SELECT id, groupName, groupDescription, creatorId, inviteCode FROM groups g JOIN group_members gm ON g.id = gm.groupId WHERE gm.userID = ?').all(userId);
  res.json(groups);
});

router.get('/:groupId', (req, res) => {
  const { groupId } = req.params;
  try {
    const group = db.prepare('SELECT * FROM groups WHERE id = ?').get(groupId);
    res.json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/creator/:groupid', (req, res) => {
  const { groupid } = req.params;
  try {
    const user = db.prepare('SELECT users.id, firstName, lastName, email, username FROM users JOIN groups ON users.id == groups.creatorId WHERE groups.id = ?').get(groupid);
    delete user.password;
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/members/:groupId', (req, res) => {
  const { groupId } = req.params;
  try {
    const members = db.prepare('SELECT id,firstName,lastName,email,username FROM users JOIN group_members ON users.id = group_members.userId WHERE group_members.groupId = ?').all(groupId);
    res.json(members);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/create', (req, res) => {
  const { groupName, groupDescription, creatorId } = req.body;
  const id = uuidv4();
  const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  try {
    db.prepare('INSERT INTO groups (id, groupName, groupDescription, creatorId, inviteCode) VALUES (?, ?, ?, ?, ?)')
      .run(id, groupName, groupDescription, creatorId, inviteCode);
    db.prepare('INSERT INTO group_members (groupId, userId) VALUES (?, ?)').run(id, creatorId);
    res.status(201).json({ id, groupName, groupDescription, creatorId, inviteCode });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/join', (req, res) => {
  const { inviteCode, userId } = req.body;
  try {
    const group = db.prepare('SELECT id, groupName FROM groups WHERE inviteCode = ?').get(inviteCode);
    if (!group){
      return res.status(404).json({ error: 'Group not found' });
    }
    db.prepare('INSERT OR IGNORE INTO group_members (groupId, userId) VALUES (?, ?)').run(group.id, userId);

    res.json({ message: 'Joined group successfully', groupId: group.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:groupId', (req, res) => {
  const { groupId } = req.params;
  try {
    db.prepare('DELETE FROM group_members WHERE groupId = ?').run(groupId);
    db.prepare('DELETE FROM groups WHERE id = ?').run(groupId);
    res.json({ message: 'Group deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:groupId/member/:userId', (req, res) => {
  const { groupId, userId } = req.params;
  const requesterId = req.headers['x-user-id'];

  try {
    const group = db.prepare('SELECT creatorId FROM groups WHERE id = ?').get(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (group.creatorId !== requesterId) {
      return res.status(403).json({ error: 'Only the group owner can kick members' });
    }

    if (group.creatorId === userId) {
      return res.status(400).json({ error: 'Owner cannot be kicked' });
    }

    db.prepare('DELETE FROM group_members WHERE groupId = ? AND userId = ?').run(groupId, userId);
    res.json({ message: 'Member kicked successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
