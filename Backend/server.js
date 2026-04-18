const express = require('express');
const cors = require('cors');
const db = require('./database');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Gemini AI Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

app.get('/', (req, res) => {
  res.send('GACS server is running');
});

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

app.get('/user/:id', (req, res) => {
  const { id } = req.params;
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    delete user.password;
    res.json(user);
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

app.get('/groups/:id', (req, res) => {
  const { id } = req.params;
  try {
    const group = db.prepare('SELECT * FROM groups WHERE id = ?').get(id);
    res.json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/groups/members/:id', (req, res) => {
  const { id } = req.params;
  try {
    const members = db.prepare('SELECT id,firstName,lastName,email,username FROM users JOIN group_members ON users.id = group_members.userId WHERE group_members.groupId = ?').all(id);
    res.json(members);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.patch('/groups/:id', (req, res) => {
  const { id } = req.params;
  const { members } = req.body; // Array of user IDs

  try {
    // For simplicity, we'll just insert new members. 
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

app.delete('/groups/:groupId/members/:userId', (req, res) => {
  const { groupId, userId } = req.params;
  const requesterId = req.headers['x-user-id']; // Simple way to pass current user

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

app.post('/groups/join', (req, res) => {
  const { inviteCode, userId } = req.body;
  try {
    const group = db.prepare('SELECT id, groupName FROM groups WHERE inviteCode = ?').get(inviteCode);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    const user = db.prepare('SELECT firstName, lastName FROM users WHERE id = ?').get(userId);

    db.prepare('INSERT OR IGNORE INTO group_members (groupId, userId) VALUES (?, ?)').run(group.id, userId);

    // Log Notification
    const notifId = uuidv4();
    const message = `${user.firstName} ${user.lastName} joined the group "${group.groupName}"`;
    db.prepare('INSERT INTO notifications (id, groupId, userId, type, message) VALUES (?, ?, ?, ?, ?)')
      .run(notifId, group.id, userId, 'MEMBER_JOIN', message);

    res.json({ message: 'Joined group successfully', groupId: group.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/notifications/:groupId', (req, res) => {
  const { groupId } = req.params;
  try {
    const notifs = db.prepare('SELECT * FROM notifications WHERE groupId = ? ORDER BY createdAt DESC LIMIT 20').all(groupId);
    res.json(notifs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/ai/breakdown', async (req, res) => {
  const { assignmentName, assignmentDescription, memberCount } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "Gemini API key not configured. Please add it to .env" });
  }

  const prompt = `
    Analyze this project assignment and break it down into ${memberCount || 4} to ${Math.max((memberCount || 4) * 2, 6)} logical, balanced subtasks.
    
    Assignment Name: ${assignmentName}
    Description: ${assignmentDescription}
    Member Count: ${memberCount}
    
    Return the response ONLY as a JSON object with a "tasks" array. Each task should have:
    - "taskName": a short, clear name
    - "taskDescription": a detailed description of what needs to be done
    - "estimatedHours": a numberrepresenting the time effort
    
    Format: {"tasks": [{"taskName": "...", "taskDescription": "...", "estimatedHours": 0}, ...]}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean potential markdown from response
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const data = JSON.parse(text);
    res.json(data);
  } catch (err) {
    console.error("AI Generation Error:", err);
    res.status(500).json({ error: "Failed to generate AI breakdown: " + err.message });
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
  const tasks = db.prepare(`
    SELECT tasks.*, users.firstName || ' ' || users.lastName as responsibleMemberName 
    FROM tasks 
    LEFT JOIN users ON tasks.responsibleMemberId = users.id
  `).all();
  res.json(tasks.map(t => ({
    ...t,
    parentAssignment: t.parentAssignmentId,
    responsibleMember: t.responsibleMemberId
  })));
});

// Update Assignment Guidelines
app.patch('/assignments/:id/guidelines', upload.single('guidelineFile'), (req, res) => {
  const { id } = req.params;
  const { guidelinesText, guidelinesLink } = req.body;
  const guidelinesFile = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const fields = [];
    const values = [];
    if (guidelinesText !== undefined) { fields.push('guidelinesText = ?'); values.push(guidelinesText); }
    if (guidelinesLink !== undefined) { fields.push('guidelinesLink = ?'); values.push(guidelinesLink); }
    if (guidelinesFile) { fields.push('guidelinesFile = ?'); values.push(guidelinesFile); }

    if (fields.length > 0) {
      db.prepare(`UPDATE assignments SET ${fields.join(', ')} WHERE id = ?`).run(...values, id);
    }
    res.json({ message: 'Guidelines updated', fileUrl: guidelinesFile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start Work Timer (15 mins)
app.patch('/tasks/:id/start-work', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const workStartTime = new Date().toISOString();
  const workExpiryTime = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

  try {
    db.prepare('UPDATE tasks SET workingUserId = ?, workStartTime = ?, workExpiryTime = ?, state = ? WHERE id = ?')
      .run(userId, workStartTime, workExpiryTime, 'WORKING', id);
    res.json({ message: 'Work timer started', workExpiryTime });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Submit Work
app.patch('/tasks/:id/submit-work', upload.single('submissionFile'), (req, res) => {
  const { id } = req.params;
  const { submissionReport, submissionLink } = req.body;
  const submissionFile = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    db.prepare('UPDATE tasks SET submissionReport = ?, submissionFile = ?, submissionLink = ?, submissionStatus = ?, state = ?, workingUserId = NULL, workEndTime = ? WHERE id = ?')
      .run(submissionReport, submissionFile, submissionLink, 'PENDING', 'DONE', new Date().toISOString(), id);
    res.json({ message: 'Work submitted for verification', fileUrl: submissionFile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Verify Submission
app.patch('/tasks/:id/verify-submission', (req, res) => {
  const { id } = req.params;
  const { status, feedback } = req.body; // status: 'ACCEPTED', 'REJECTED'

  try {
    let newState = 'DONE';
    if (status === 'REJECTED') {
      newState = 'YET'; // Reassign or back to start
    }

    db.prepare('UPDATE tasks SET submissionStatus = ?, state = ? WHERE id = ?')
      .run(status, newState, id);

    res.json({ message: `Submission ${status.toLowerCase()}`, newState });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
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
