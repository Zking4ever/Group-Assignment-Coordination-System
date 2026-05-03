const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    firstName TEXT,
    lastName TEXT,
    email TEXT UNIQUE,
    password TEXT,
    username TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS groups (
    id TEXT PRIMARY KEY,
    groupName TEXT,
    groupDescription TEXT,
    creatorId TEXT,
    inviteCode TEXT,
    FOREIGN KEY (creatorId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS group_members (
    groupId TEXT,
    userId TEXT,
    PRIMARY KEY (groupId, userId),
    FOREIGN KEY (groupId) REFERENCES groups(id),
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS assignments (
    id TEXT PRIMARY KEY,
    assignmentName TEXT,
    assignmentDescription TEXT,
    creatorId TEXT,
    groupId TEXT,
    guidelinesText TEXT,
    guidelinesFile TEXT,
    guidelinesLink TEXT,
    FOREIGN KEY (creatorId) REFERENCES users(id),
    FOREIGN KEY (groupId) REFERENCES groups(id)
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    taskName TEXT,
    taskDescription TEXT,
    responsibleMemberId TEXT,
    startDate TEXT,
    deadLine TEXT,
    parentAssignmentId TEXT,
    state TEXT,
    workingUserId TEXT,
    workStartTime TEXT,
    workExpiryTime TEXT,
    submissionReport TEXT,
    submissionFile TEXT,
    submissionLink TEXT,
    submissionStatus TEXT DEFAULT 'PENDING',
    FOREIGN KEY (responsibleMemberId) REFERENCES users(id),
    FOREIGN KEY (parentAssignmentId) REFERENCES assignments(id),
    FOREIGN KEY (workingUserId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    groupId TEXT,
    userId TEXT,
    type TEXT,
    message TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (groupId) REFERENCES groups(id),
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`);

module.exports = db;
