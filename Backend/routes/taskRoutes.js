const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../utils/database');
const upload = require('../middlewares/uploadMiddleware');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "", { apiVersion: "v1" });
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

router.get('/:assignmentId',(req, res)=>{
  const { assignmentId } = req.params;
   const tasks = db.prepare(`
      SELECT tasks.*, users.firstName || ' ' || users.lastName as responsibleMemberName 
      FROM tasks 
      LEFT JOIN users ON tasks.responsibleMemberId = users.id
      WHERE parentAssignmentId = ?
    `).all(assignmentId);
  res.json(tasks.map(t => ({
    ...t,
    parentAssignment: t.parentAssignmentId,
    responsibleMember: t.responsibleMemberId
  })));
});

router.get('/detail/:taskId',(req,res)=>{
  const { taskId } = req.params;
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  res.json(task);
});

router.post('/', (req, res) => {
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

router.post('/:id/save-session', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const workStartTime = new Date(Date.now() - 20 * 60 * 1000).toISOString();

  try {
    db.prepare('INSERT INTO WorkSessionRecord (id, userId, taskId, workStartTime) VALUES (?, ?, ?, ?)')
      .run(uuidv4(), userId, id, workStartTime);
    res.json({ message: 'Work Session Ended', workStartTime });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
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


router.post('/:id/submit', upload.single('file'), (req, res) => {
  const { id } = req.params;
  const { submissionReport, submissionLink, assignmentId } = req.body;
  const submissionFile = req.file ? `/uploads/${req.file.filename}` : null;
  const date = new Date().toISOString();

  try {
    db.prepare('INSERT INTO submissions (id, taskId, assignmentId, submissionReport, submissionFile, submissionLink, submissionStatus, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run( uuidv4(), id, assignmentId, submissionReport, submissionFile, submissionLink, 'submitted',date);
    db.prepare('UPDATE tasks SET state = ? WHERE id = ?').run('submitted',id);
    res.json({ message: 'Work submitted for verification', fileUrl: submissionFile });
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:id/verify-submission', (req, res) => {
  const { id } = req.params;
  const { status, feedback } = req.body; 

  try {
    let newState = 'completed';
    if (status === 'REJECTED') {
      newState = 'yet'; 
    }

    db.prepare('UPDATE tasks SET submissionStatus = ?, state = ? WHERE id = ?')
      .run(status, newState, id);

    res.json({ message: `Submission ${status.toLowerCase()}`, newState });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/breakdown/ai', async (req, res) => {
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

    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const data = JSON.parse(text);
    res.json(data);
  } catch (err) {
    console.error("AI Generation Error:", err);
    res.status(500).json({ error: "Failed to generate AI breakdown: " + err.message });
  }
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;
