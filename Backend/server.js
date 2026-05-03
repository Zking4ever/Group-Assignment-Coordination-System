const express = require('express');
const cors = require('cors');
const db = require('./utils/database');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
// Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // 50 attempts per 15 minutes
  message: { error: "Too many authentication attempts, please try again after 15 minutes." }
});

// App Config
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/auth', authLimiter);

// Gemini AI Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "", { apiVersion: "v1" });
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
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

// --- Auth Routes ---
app.post('/auth/login', async (req, res) => {
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

app.post('/auth/register', async (req, res) => {
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

app.get('/auth/userdetail/:userId', (req, res) => {
  const { userId } = req.params;
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    delete user.password;
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// app.patch('/users/:id', (req, res) => {
//   const { id } = req.params;
//   const updates = req.body;
//   const keys = Object.keys(updates);
//   const setClause = keys.map(key => `${key} = ?`).join(', ');
//   const values = keys.map(key => updates[key]);

//   try {
//     db.prepare(`UPDATE users SET ${setClause} WHERE id = ?`).run(...values, id);
//     res.json({ message: 'User updated' });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });


// --- Groups ---

//to get all user's groups
app.get('/group/user/:userId', (req, res) => {
  const { userId } = req.params;
  const groups = db.prepare('SELECT id, groupName, groupDescription, creatorId, inviteCode FROM groups g JOIN group_members gm ON g.id = gm.groupId WHERE gm.userID = ?').all(userId);
  res.json(groups);
});

//to get detail of a single group by id
app.get('/group/:groupId', (req, res) => {
  const { groupId } = req.params;
  try {
    const group = db.prepare('SELECT * FROM groups WHERE id = ?').get(groupId);
    res.json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//to get the creator user of a group from a groupid
app.get('/group/creator/:groupid', (req, res) => {
  const { groupid } = req.params;
  try {
    const user = db.prepate('SELECT id,firstName,lastName,email,username FROM users JOIN groups ON user.id == groups.creatorId WHERE groups.id = ?').get(groupid);
    delete user.password;
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//to get all members of a group
app.get('/group/members/:groupId', (req, res) => {
  const { groupId } = req.params;
  try {
    const members = db.prepare('SELECT id,firstName,lastName,email,username FROM users JOIN group_members ON users.id = group_members.userId WHERE group_members.groupId = ?').all(groupId);
    res.json(members);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//to create a new group
app.post('/group/create', (req, res) => {
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

//to join group by invite code
app.post('/group/join', (req, res) => {
  const { inviteCode, userId } = req.body;
  try {
    const group = db.prepare('SELECT id, groupName FROM groups WHERE inviteCode = ?').get(inviteCode);
    if (!group){
      return res.status(404).json({ error: 'Group not found' });
    }
    const user = db.prepare('SELECT firstName, lastName FROM users WHERE id = ?').get(userId);

    db.prepare('INSERT OR IGNORE INTO group_members (groupId, userId) VALUES (?, ?)').run(group.id, userId);

    // // Log Notification
    // const notifId = uuidv4();
    // const message = `${user.firstName} ${user.lastName} joined the group "${group.groupName}"`;
    // db.prepare('INSERT INTO notifications (id, groupId, userId, type, message) VALUES (?, ?, ?, ?, ?)')
    //   .run(notifId, group.id, userId, 'MEMBER_JOIN', message);

    res.json({ message: 'Joined group successfully', groupId: group.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// to delete an entire group
app.delete('/group/:groupId', (req, res) => {
  const { groupId } = req.params;
  try {
    db.prepare('DELETE FROM group_members WHERE groupId = ?').run(groupId);
    db.prepare('DELETE FROM groups WHERE id = ?').run(groupId);
    res.json({ message: 'Group deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//to kick a member from a group
app.delete('/group/:groupId/member/:userId', (req, res) => {
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



////////////////////////---------- astawus ----- ////////////



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
  const { assignmentName, assignmentDescription, memberCount, guidelinesText } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "Gemini API key not configured. Please add it to .env" });
  }

  const prompt = `
    Analyze this project assignment and break it down into ${memberCount || 4} to ${Math.max((memberCount || 4) * 2, 6)} logical, balanced subtasks.
    
    Assignment Name: ${assignmentName}
    Description: ${assignmentDescription}
    ${guidelinesText ? `Project Guidelines: ${guidelinesText}` : ""}
    Member Count: ${memberCount}
    
    Return the response ONLY as a JSON object with a "tasks" array. Each task should have:
    - "taskName": a short, clear name
    - "taskDescription": a detailed description of what needs to be done
    - "estimatedHours": a number representing the time effort
    
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

app.post('/assignments', upload.single('guidelineFile'), (req, res) => {
  const { assignmentName, assignmentDescription, creatorId, parentGroup, guidelinesText, guidelinesLink } = req.body;
  const guidelinesFile = req.file ? `/uploads/${req.file.filename}` : null;
  const id = uuidv4();
  try {
    db.prepare('INSERT INTO assignments (id, assignmentName, assignmentDescription, creatorId, groupId, guidelinesText, guidelinesLink, guidelinesFile) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, assignmentName, assignmentDescription, creatorId, parentGroup, guidelinesText || null, guidelinesLink || null, guidelinesFile || null);
    res.status(201).json({ id, assignmentName, assignmentDescription, creatorId, parentGroup, guidelinesFile });
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

// Start Work Timer (20 mins)
app.patch('/tasks/:id/start-work', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const workStartTime = new Date().toISOString();
  const workExpiryTime = new Date(Date.now() + 20 * 60 * 1000).toISOString(); // 20 mins

  try {
    db.prepare('UPDATE tasks SET workingUserId = ?, workStartTime = ?, workExpiryTime = ?, state = ? WHERE id = ?')
      .run(userId, workStartTime, workExpiryTime, 'working', id);
    res.json({ message: 'Work timer started', workExpiryTime });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Record Expired Session (internal use or trigger from frontend)
app.post('/tasks/:id/record-expiry', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const task = db.prepare('SELECT parentAssignmentId FROM tasks WHERE id = ?').get(id);
    const assignment = db.prepare('SELECT groupId FROM assignments WHERE id = ?').get(task.parentAssignmentId);

    const notifId = uuidv4();
    const message = `Task work session expired for user ${userId}`;
    db.prepare('INSERT INTO notifications (id, groupId, userId, type, message) VALUES (?, ?, ?, ?, ?)')
      .run(notifId, assignment.groupId, userId, 'SESSION_EXPIRED', message);
    res.json({ message: 'Expiry recorded' });
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
      .run(submissionReport, submissionFile, submissionLink, 'submitted', 'submitted', new Date().toISOString(), id);
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
    let newState = 'completed';
    if (status === 'REJECTED') {
      newState = 'yet'; // Reassign or back to start
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
      .run(id, taskName, taskDescription, responsibleMember, startDate, deadLine, parentAssignment, state || 'yet');
    res.status(201).json({ id, taskName, taskDescription, responsibleMember, startDate, deadLine, parentAssignment, state: state || 'yet' });
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
