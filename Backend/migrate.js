const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new Database(dbPath);

console.log('Running migrations...');

const applyMigration = (tableName, columnName, definition) => {
    try {
        db.prepare(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`).run();
        console.log(`Added column ${columnName} to ${tableName}`);
    } catch (err) {
        if (err.message.includes('duplicate column name')) {
            console.log(`Column ${columnName} already exists in ${tableName}`);
        } else {
            console.error(`Error adding ${columnName} to ${tableName}:`, err.message);
        }
    }
};

// Assignments table
applyMigration('assignments', 'guidelinesText', 'TEXT');
applyMigration('assignments', 'guidelinesFile', 'TEXT');
applyMigration('assignments', 'guidelinesLink', 'TEXT');

// Tasks table
applyMigration('tasks', 'workingUserId', 'TEXT');
applyMigration('tasks', 'workStartTime', 'TEXT');
applyMigration('tasks', 'workExpiryTime', 'TEXT');
applyMigration('tasks', 'submissionReport', 'TEXT');
applyMigration('tasks', 'submissionFile', 'TEXT');
applyMigration('tasks', 'submissionLink', 'TEXT');
applyMigration('tasks', 'submissionStatus', "TEXT DEFAULT 'PENDING'");

// Create notifications table if not exists (handled by database.js as well, but being safe)
db.exec(`
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

console.log('Migrations completed.');
process.exit(0);
