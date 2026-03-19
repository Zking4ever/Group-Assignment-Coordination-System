const express = require('express');
const cors = require('cors');
const db = require('./database');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- Users ---
app.get('/users', (req, res) => {
  const { email, password } = req.query;
  if (email && password) {
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);
    return res.json(user ? [user] : []);
  }
  const users = db.prepare('SELECT * FROM users').all();
  res.json(users);
});

app.post('/users', (req, res) => {
  const { firstName, lastName, email, password, username } = req.body;
  const id = uuidv4();
  try {
    db.prepare('INSERT INTO users (id, firstName, lastName, email, password, username) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, firstName, lastName, email, password, username);
    res.status(201).json({ id, firstName, lastName, email, username });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/users/:id', (req, res) => {
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

// --- Groups ---
app.get('/groups', (req, res) => {
  const groups = db.prepare('SELECT * FROM groups').all();
  // Fetch members for each group to maintain compatibility with db.json structure
  const groupsWithMembers = groups.map(group => {
    const members = db.prepare('SELECT userId FROM group_members WHERE groupId = ?').all(group.id);
    return { ...group, members: members.map(m => m.userId) };
  });
  res.json(groupsWithMembers);
});

app.post('/groups', (req, res) => {
  const { groupName, groupDescription, creator, creatorId } = req.body;
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

app.patch('/groups/:id', (req, res) => {
  const { id } = req.params;
  const { members } = req.body; // Array of user IDs
  
  try {
    // For simplicity, we'll just insert new members. 
    // In a real app, we'd sync them.
    const insertMember = db.prepare('INSERT OR IGNORE INTO group_members (groupId, userId) VALUES (?, ?)');
    members.forEach(userId => insertMember.run(id, userId));
    res.json({ message: 'Members updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/groups/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM group_members WHERE groupId = ?').run(id);
    db.prepare('DELETE FROM groups WHERE id = ?').run(id);
    res.json({ message: 'Group deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Assignments ---
app.get('/assignments', (req, res) => {
  const assignments = db.prepare('SELECT * FROM assignments').all();
  // Map back to parentGroup field for frontend compatibility
  res.json(assignments.map(a => ({ ...a, parentGroup: a.groupId })));
});

app.post('/assignments', (req, res) => {
  const { assignmentName, assignmentDescription, creatorId, parentGroup } = req.body;
  const id = uuidv4();
  try {
    db.prepare('INSERT INTO assignments (id, assignmentName, assignmentDescription, creatorId, groupId) VALUES (?, ?, ?, ?, ?)')
      .run(id, assignmentName, assignmentDescription, creatorId, parentGroup);
    res.status(201).json({ id, assignmentName, assignmentDescription, creatorId, parentGroup });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/assignments/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM assignments WHERE id = ?').run(id);
    res.json({ message: 'Assignment deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Tasks ---
app.get('/tasks', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks').all();
  // Map back to parentAssignment and responsibleMember for frontend compatibility
  res.json(tasks.map(t => ({ 
    ...t, 
    parentAssignment: t.parentAssignmentId, 
    responsibleMember: t.responsibleMemberId 
  })));
});

app.post('/tasks', (req, res) => {
  const { taskName, taskDescription, responsibleMember, startDate, deadLine, parentAssignment, state } = req.body;
  const id = uuidv4();
  try {
    db.prepare('INSERT INTO tasks (id, taskName, taskDescription, responsibleMemberId, startDate, deadLine, parentAssignmentId, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, taskName, taskDescription, responsibleMember, startDate, deadLine, parentAssignment, state || 'YET');
    res.status(201).json({ id, taskName, taskDescription, responsibleMember, startDate, deadLine, parentAssignment, state: state || 'YET' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  // Map frontend fields (responsibleMember, parentAssignment) to DB fields
  if (updates.responsibleMember) {
    updates.responsibleMemberId = updates.responsibleMember;
    delete updates.responsibleMember;
  }
  if (updates.parentAssignment) {
    updates.parentAssignmentId = updates.parentAssignment;
    delete updates.parentAssignment;
  }

  const keys = Object.keys(updates);
  const setClause = keys.map(key => `${key} = ?`).join(', ');
  const values = keys.map(key => updates[key]);

  try {
    db.prepare(`UPDATE tasks SET ${setClause} WHERE id = ?`).run(...values, id);
    res.json({ message: 'Task updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
