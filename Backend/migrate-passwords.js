const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new Database(dbPath);

console.log('Starting password migration...');

const users = db.prepare('SELECT id, password FROM users').all();
let migratedCount = 0;

const updateStmt = db.prepare('UPDATE users SET password = ? WHERE id = ?');

users.forEach(user => {
    // Basic check to see if password is already hashed (bcrypt hashes start with $2a$ or $2b$)
    if (!user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
        console.log(`Hashing password for user: ${user.id}`);
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user.password, salt);
        updateStmt.run(hash, user.id);
        migratedCount++;
    } else {
        console.log(`User ${user.id} already has a hashed password. Skipping.`);
    }
});

console.log(`Migration complete. ${migratedCount} passwords updated.`);
db.close();
