const express = require('express');
const cors = require('cors');
const db = require('./database');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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
    const group = db.prepare('SELECT id FROM groups WHERE inviteCode = ?').get(inviteCode);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    db.prepare('INSERT OR IGNORE INTO group_members (groupId, userId) VALUES (?, ?)').run(group.id, userId);
    res.json({ message: 'Joined group successfully', groupId: group.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/ai/breakdown', (req, res) => {
  const { assignmentName, assignmentDescription, memberCount } = req.body;

  // Smart Simulator Logic
  // In a real app, this would call an LLM API
  const mockTasks = [
    {
      taskName: `Research for ${assignmentName}`,
      taskDescription: `Initial research and documentation for ${assignmentDescription}.`,
      estimatedHours: 4
    },
    {
      taskName: `Drafting Structure`,
      taskDescription: `Creating the main outline and structure of the assignment.`,
      estimatedHours: 3
    },
    {
      taskName: `Core Implementation/Writing`,
      taskDescription: `Executing the main parts of the assignment.`,
      estimatedHours: 8
    },
    {
      taskName: `Review & Quality Assurance`,
      taskDescription: `Final proofreading and checking against requirements.`,
      estimatedHours: 3
    }
  ];

  // Adjust based on member count
  let resultTasks = [...mockTasks];
  if (memberCount > 4) {
    resultTasks.push({
      taskName: `Presentation/Final Formatting`,
      taskDescription: `Preparing the final delivery format and presentation materials.`,
      estimatedHours: 5
    });
  }

  // Add some variety based on description length
  if (assignmentDescription.length > 100) {
    resultTasks[2].taskName = `Detailed Implementation - Part 1`;
    resultTasks.push({
      taskName: `Detailed Implementation - Part 2`,
      taskDescription: `Continuing the work started in Part 1.`,
      estimatedHours: 8
    });
  }

  setTimeout(() => {
    res.json({ tasks: resultTasks });
  }, 1500); // Simulate network/AI delay
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
