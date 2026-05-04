const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../utils/database');
const upload = require('../middlewares/uploadMiddleware');

router.get('/:groupId', (req, res) => {
  const { groupId } = req.params;
  const assignments = db.prepare('SELECT * FROM assignments where groupId = ?').all(groupId);
  res.json(assignments.map(a => ({ ...a, parentGroup: a.groupId })));
});

router.get('/detail/:assignmentId', (req, res) => {
  const { assignmentId } = req.params;
  const assignment = db.prepare('SELECT * FROM assignments where id = ?').get(assignmentId);
  res.json(assignment);
});

router.post('/', upload.single('guidelineFile'), (req, res) => {
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

router.patch('/:id/title', upload.single('guidelineFile'), (req, res) => {
  const { id } = req.params;
  const { assignmentName, assignmentDescription, guidelinesText, guidelinesLink } = req.body;
 
  db.prepare('UPDATE assignments SET assignmentName = ? WHERE id = ?').run(updated.assignmentName, id);
  res.json({ message: 'Assignment updated' });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM assignments WHERE id = ?').run(id);
    res.json({ message: 'Assignment deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
