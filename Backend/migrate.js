const db = require('./database');
const fs = require('fs');
const path = require('path');

const dbJsonPath = path.resolve(__dirname, 'db.json');
const data = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));

// Migrate users
const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (id, firstName, lastName, email, password, username)
  VALUES (?, ?, ?, ?, ?, ?)
`);

data.users.forEach(user => {
  insertUser.run(user.id, user.firstName, user.lastName, user.email, user.password, user.username);
});

// Migrate groups
const insertGroup = db.prepare(`
  INSERT OR IGNORE INTO groups (id, groupName, groupDescription, creatorId, inviteCode)
  VALUES (?, ?, ?, ?, ?)
`);

const insertMember = db.prepare(`
  INSERT OR IGNORE INTO group_members (groupId, userId)
  VALUES (?, ?)
`);

data.groups.forEach(group => {
  const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  insertGroup.run(group.id, group.groupName, group.groupDescription, group.creatorId, inviteCode);
  
  group.members.forEach(memberId => {
    insertMember.run(group.id, memberId);
  });
});

// Migrate assignments
const insertAssignment = db.prepare(`
  INSERT OR IGNORE INTO assignments (id, assignmentName, assignmentDescription, creatorId, groupId)
  VALUES (?, ?, ?, ?, ?)
`);

data.assignments.forEach(ass => {
  insertAssignment.run(ass.id, ass.assignmentName, ass.assignmentDescription, ass.creatorId, ass.parentGroup);
});

// Migrate tasks
const insertTask = db.prepare(`
  INSERT OR IGNORE INTO tasks (id, taskName, taskDescription, responsibleMemberId, startDate, deadLine, parentAssignmentId, state)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

data.tasks.forEach(task => {
  insertTask.run(task.id, task.taskName, task.taskDescription, task.responsibleMember, task.startDate, task.deadLine, task.parentAssignment, task.state);
});

console.log('Migration completed successfully!');
